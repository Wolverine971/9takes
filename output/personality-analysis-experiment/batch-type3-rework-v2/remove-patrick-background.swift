import AppKit
import CoreImage
import CoreVideo
import Foundation
import Vision

let inputURL = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-type3-rework-v2/patrick-starr/source.jpg")
let outputURL = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-type3-rework-v2/patrick-starr/cutout.png")
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let context = CIContext(options: [.workingColorSpace: colorSpace, .outputColorSpace: colorSpace])

guard let image = NSImage(contentsOf: inputURL) else { exit(1) }
var proposedRect = NSRect(origin: .zero, size: image.size)
guard let cgImage = image.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil) else { exit(1) }
let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8
try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])
guard let observation = request.results?.first else { exit(1) }
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
try context.writePNGRepresentation(of: isolated, to: outputURL, format: .RGBA8, colorSpace: colorSpace)
print("Wrote \(outputURL.path)")
