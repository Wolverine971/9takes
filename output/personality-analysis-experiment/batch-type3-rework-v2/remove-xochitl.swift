import AppKit
import CoreImage
import CoreVideo
import Foundation
import Vision

let root = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-type3-rework-v2/xochitl-gomez")
let inputURL = root.appendingPathComponent("source.jpg")
let outputURL = root.appendingPathComponent("cutout.png")
let image = NSImage(contentsOf: inputURL)!
var rect = NSRect(origin: .zero, size: image.size)
let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8
try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])
let foreground = CIImage(cgImage: cgImage)
let rawMask = CIImage(cvPixelBuffer: request.results!.first!.pixelBuffer)
let mask = rawMask.transformed(by: CGAffineTransform(scaleX: foreground.extent.width / rawMask.extent.width,
                                                     y: foreground.extent.height / rawMask.extent.height))
let isolated = foreground.applyingFilter("CIBlendWithMask", parameters: [
    kCIInputBackgroundImageKey: CIImage(color: .clear).cropped(to: foreground.extent),
    kCIInputMaskImageKey: mask,
])
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
try CIContext().writePNGRepresentation(of: isolated, to: outputURL, format: .RGBA8, colorSpace: colorSpace)
