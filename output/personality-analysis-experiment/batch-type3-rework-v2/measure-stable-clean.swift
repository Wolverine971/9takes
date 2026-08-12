import AppKit
import Foundation
import Vision

let inputURL = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-type3-rework-v2/stable-ronaldo/cutout.png")
guard let image = NSImage(contentsOf: inputURL) else { exit(1) }
var rect = NSRect(origin: .zero, size: image.size)
guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else { exit(1) }
let request = VNDetectFaceLandmarksRequest()
try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])
guard let face = request.results?.first,
      let leftEye = face.landmarks?.leftEye,
      let rightEye = face.landmarks?.rightEye else { exit(1) }

func centroid(_ region: VNFaceLandmarkRegion2D) -> CGPoint {
    let sum = region.normalizedPoints.reduce(CGPoint.zero) { partial, point in
        CGPoint(x: partial.x + point.x, y: partial.y + point.y)
    }
    let local = CGPoint(x: sum.x / CGFloat(region.pointCount), y: sum.y / CGFloat(region.pointCount))
    let imageX = face.boundingBox.origin.x + local.x * face.boundingBox.width
    let imageY = face.boundingBox.origin.y + local.y * face.boundingBox.height
    return CGPoint(x: imageX * CGFloat(cgImage.width), y: (1 - imageY) * CGFloat(cgImage.height))
}
let first = centroid(leftEye)
let second = centroid(rightEye)
let left = first.x < second.x ? first : second
let right = first.x < second.x ? second : first
let angle = atan2(right.y - left.y, right.x - left.x) * 180 / .pi
print(String(format: "%d,%d,%.3f,%.3f,%.3f,%.3f,%.3f", cgImage.width, cgImage.height,
             left.x, left.y, right.x, right.y, -angle))
