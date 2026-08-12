import AppKit
import Foundation
import Vision

let url = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-type3-rework-v2/xochitl-gomez/source.jpg")
let image = NSImage(contentsOf: url)!
var rect = NSRect(origin: .zero, size: image.size)
let cg = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
let request = VNDetectFaceLandmarksRequest()
try VNImageRequestHandler(cgImage: cg, orientation: .up).perform([request])
let face = request.results!.first!
func centroid(_ region: VNFaceLandmarkRegion2D) -> CGPoint {
    let sum = region.normalizedPoints.reduce(CGPoint.zero) { CGPoint(x: $0.x + $1.x, y: $0.y + $1.y) }
    let local = CGPoint(x: sum.x / CGFloat(region.pointCount), y: sum.y / CGFloat(region.pointCount))
    return CGPoint(x: (face.boundingBox.origin.x + local.x * face.boundingBox.width) * CGFloat(cg.width),
                   y: (1 - (face.boundingBox.origin.y + local.y * face.boundingBox.height)) * CGFloat(cg.height))
}
let first = centroid(face.landmarks!.leftEye!)
let second = centroid(face.landmarks!.rightEye!)
let left = first.x < second.x ? first : second
let right = first.x < second.x ? second : first
let correction = -atan2(right.y - left.y, right.x - left.x) * 180 / .pi
print(String(format: "%d,%d,%.3f,%.3f,%.3f,%.3f,%.3f", cg.width, cg.height,
             left.x, left.y, right.x, right.y, correction))
