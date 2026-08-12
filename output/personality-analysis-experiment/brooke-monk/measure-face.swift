import AppKit
import Foundation
import Vision

guard CommandLine.arguments.count == 2 else {
    fputs("Usage: measure-face.swift input\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
guard let image = NSImage(contentsOf: inputURL) else {
    throw NSError(domain: "MeasureFace", code: 1,
                  userInfo: [NSLocalizedDescriptionKey: "Could not load image"])
}

var rect = NSRect(origin: .zero, size: image.size)
guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
    throw NSError(domain: "MeasureFace", code: 2,
                  userInfo: [NSLocalizedDescriptionKey: "Could not decode image"])
}

let request = VNDetectFaceLandmarksRequest()
try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])

guard let face = request.results?.first,
      let leftEye = face.landmarks?.leftEye,
      let rightEye = face.landmarks?.rightEye else {
    throw NSError(domain: "MeasureFace", code: 3,
                  userInfo: [NSLocalizedDescriptionKey: "Could not detect both eyes"])
}

func centroid(_ region: VNFaceLandmarkRegion2D) -> CGPoint {
    let sum = region.normalizedPoints.reduce(CGPoint.zero) { partial, point in
        CGPoint(x: partial.x + point.x, y: partial.y + point.y)
    }
    let local = CGPoint(x: sum.x / CGFloat(region.pointCount),
                        y: sum.y / CGFloat(region.pointCount))
    let imageX = face.boundingBox.origin.x + local.x * face.boundingBox.width
    let imageY = face.boundingBox.origin.y + local.y * face.boundingBox.height
    return CGPoint(x: imageX * CGFloat(cgImage.width),
                   y: (1 - imageY) * CGFloat(cgImage.height))
}

let left = centroid(leftEye)
let right = centroid(rightEye)
let screenLeft = left.x < right.x ? left : right
let screenRight = left.x < right.x ? right : left
let angle = atan2(screenRight.y - screenLeft.y, screenRight.x - screenLeft.x) * 180 / .pi

print(String(format: "image=%dx%d", cgImage.width, cgImage.height))
print(String(format: "screenLeft=(%.2f, %.2f)", screenLeft.x, screenLeft.y))
print(String(format: "screenRight=(%.2f, %.2f)", screenRight.x, screenRight.y))
print(String(format: "eyeLineDegrees=%.3f", angle))
print(String(format: "clockwiseCorrectionDegrees=%.3f", -angle))
