import AppKit
import CoreImage
import CoreVideo
import Foundation
import Vision

guard CommandLine.arguments.count == 3 else {
    fputs("Usage: remove-background.swift input output\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

guard let image = NSImage(contentsOf: inputURL) else {
    throw NSError(domain: "RemoveBackground", code: 1,
                  userInfo: [NSLocalizedDescriptionKey: "Could not load input image"])
}

var proposedRect = NSRect(origin: .zero, size: image.size)
guard let cgImage = image.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil) else {
    throw NSError(domain: "RemoveBackground", code: 2,
                  userInfo: [NSLocalizedDescriptionKey: "Could not decode input image"])
}

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8

let handler = VNImageRequestHandler(cgImage: cgImage, orientation: .up)
try handler.perform([request])

guard let observation = request.results?.first else {
    throw NSError(domain: "RemoveBackground", code: 3,
                  userInfo: [NSLocalizedDescriptionKey: "No person mask was produced"])
}

let foreground = CIImage(cgImage: cgImage)
let rawMask = CIImage(cvPixelBuffer: observation.pixelBuffer)
let mask = rawMask.transformed(by: CGAffineTransform(
    scaleX: foreground.extent.width / rawMask.extent.width,
    y: foreground.extent.height / rawMask.extent.height
))
let transparent = CIImage(color: .clear).cropped(to: foreground.extent)

let isolated = foreground.applyingFilter("CIBlendWithMask", parameters: [
    kCIInputBackgroundImageKey: transparent,
    kCIInputMaskImageKey: mask,
])

let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let context = CIContext(options: [
    .workingColorSpace: colorSpace,
    .outputColorSpace: colorSpace,
])

try context.writePNGRepresentation(
    of: isolated,
    to: outputURL,
    format: .RGBA8,
    colorSpace: colorSpace
)

print("Wrote \(outputURL.path)")
