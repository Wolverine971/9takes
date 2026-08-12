import AppKit
import CoreImage
import CoreVideo
import Foundation
import Vision

let allPeople = [
    "david-beckham",
    "gal-gadot",
    "halle-berry",
    "jackson-wang",
    "jared-kushner",
    "josh-richards",
    "jynxzi",
]
let people = CommandLine.arguments.count > 1 ? Array(CommandLine.arguments.dropFirst()) : allPeople

let root = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-next-10")
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let context = CIContext(options: [
    .workingColorSpace: colorSpace,
    .outputColorSpace: colorSpace,
])

func removeBackground(for slug: String) throws {
    let directory = root.appendingPathComponent(slug)
    let inputURL = directory.appendingPathComponent("source.jpg")
    let outputURL = directory.appendingPathComponent("cutout.png")

    guard let image = NSImage(contentsOf: inputURL) else {
        throw NSError(domain: "RemoveBackground", code: 1,
                      userInfo: [NSLocalizedDescriptionKey: "Could not load \(inputURL.path)"])
    }

    var proposedRect = NSRect(origin: .zero, size: image.size)
    guard let cgImage = image.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil) else {
        throw NSError(domain: "RemoveBackground", code: 2,
                      userInfo: [NSLocalizedDescriptionKey: "Could not decode \(inputURL.path)"])
    }

    let request = VNGeneratePersonSegmentationRequest()
    request.qualityLevel = .accurate
    request.outputPixelFormat = kCVPixelFormatType_OneComponent8
    try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])

    guard let observation = request.results?.first else {
        throw NSError(domain: "RemoveBackground", code: 3,
                      userInfo: [NSLocalizedDescriptionKey: "No mask for \(slug)"])
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

    try context.writePNGRepresentation(
        of: isolated,
        to: outputURL,
        format: .RGBA8,
        colorSpace: colorSpace
    )
    print("Wrote \(outputURL.path)")
}

for person in people {
    do {
        try removeBackground(for: person)
    } catch {
        fputs("FAILED \(person): \(error)\n", stderr)
    }
}
