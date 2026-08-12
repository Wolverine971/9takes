import AppKit
import Foundation
import Vision

let paths = [
    "patrick-starr": "output/personality-analysis-experiment/batch-type3-rework-v2/patrick-starr/cutout.png",
    "ted-bundy": "output/personality-analysis-experiment/batch-type3-rework-v2/ted-bundy/cutout.png",
]

func centroid(_ region: VNFaceLandmarkRegion2D, face: VNFaceObservation, width: Int, height: Int) -> CGPoint {
    let sum = region.normalizedPoints.reduce(CGPoint.zero) { partial, point in
        CGPoint(x: partial.x + point.x, y: partial.y + point.y)
    }
    let local = CGPoint(x: sum.x / CGFloat(region.pointCount), y: sum.y / CGFloat(region.pointCount))
    return CGPoint(
        x: (face.boundingBox.origin.x + local.x * face.boundingBox.width) * CGFloat(width),
        y: (1 - (face.boundingBox.origin.y + local.y * face.boundingBox.height)) * CGFloat(height)
    )
}

for (slug, path) in paths {
    let image = NSImage(contentsOfFile: path)!
    var rect = NSRect(origin: .zero, size: image.size)
    let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
    let request = VNDetectFaceLandmarksRequest()
    try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])
    let face = request.results!.first!
    let first = centroid(face.landmarks!.leftEye!, face: face, width: cgImage.width, height: cgImage.height)
    let second = centroid(face.landmarks!.rightEye!, face: face, width: cgImage.width, height: cgImage.height)
    let left = first.x < second.x ? first : second
    let right = first.x < second.x ? second : first
    let correction = -atan2(right.y - left.y, right.x - left.x) * 180 / .pi
    print(String(format: "%@,%d,%d,%.3f,%.3f,%.3f,%.3f,%.3f", slug, cgImage.width, cgImage.height,
                 left.x, left.y, right.x, right.y, correction))
}
