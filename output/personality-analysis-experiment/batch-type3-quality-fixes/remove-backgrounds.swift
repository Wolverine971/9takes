import AppKit
import CoreImage
import CoreVideo
import Foundation
import Vision

let people = [
    "madonna", "margaret-qualley", "michael-le", "n3on", "patrick-starr",
    "riyaz-aly", "stable-ronaldo", "tate-mcrae", "ted-bundy", "xochitl-gomez",
]
let root = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-type3-quality-fixes")
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let context = CIContext(options: [.workingColorSpace: colorSpace, .outputColorSpace: colorSpace])

for slug in people {
    let directory = root.appendingPathComponent(slug)
    let inputURL = directory.appendingPathComponent("source.jpg")
    let outputURL = directory.appendingPathComponent("cutout.png")

    guard let image = NSImage(contentsOf: inputURL) else {
        fputs("MISSING \(slug)\n", stderr)
        continue
    }
    var proposedRect = NSRect(origin: .zero, size: image.size)
    guard let cgImage = image.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil) else {
        fputs("DECODE FAILED \(slug)\n", stderr)
        continue
    }

    let request = VNGeneratePersonSegmentationRequest()
    request.qualityLevel = .accurate
    request.outputPixelFormat = kCVPixelFormatType_OneComponent8
    try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])
    guard let observation = request.results?.first else {
        fputs("NO MASK \(slug)\n", stderr)
        continue
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

    try context.writePNGRepresentation(of: isolated, to: outputURL, format: .RGBA8, colorSpace: colorSpace)
    print("Wrote \(outputURL.path)")
}
