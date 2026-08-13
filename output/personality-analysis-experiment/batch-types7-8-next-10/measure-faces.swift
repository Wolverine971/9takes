import AppKit
import Foundation
import Vision

let people = [
    "shakira", "spencer-x", "stavros-halkias", "steve-irwin", "tana-mongeau",
    "travis-kelce", "bryce-hall", "duke-dennis", "idris-elba", "jenna-marbles",
]
let root = URL(fileURLWithPath: "output/personality-analysis-experiment/batch-types7-8-next-10")
let pngSources = Set([
    "spencer-x", "stavros-halkias", "steve-irwin", "tana-mongeau", "travis-kelce",
    "bryce-hall", "duke-dennis", "idris-elba", "jenna-marbles",
])

func centroid(_ region: VNFaceLandmarkRegion2D, face: VNFaceObservation, width: Int, height: Int) -> CGPoint {
    let sum = region.normalizedPoints.reduce(CGPoint.zero) { partial, point in
        CGPoint(x: partial.x + point.x, y: partial.y + point.y)
    }
    let local = CGPoint(x: sum.x / CGFloat(region.pointCount), y: sum.y / CGFloat(region.pointCount))
    let imageX = face.boundingBox.origin.x + local.x * face.boundingBox.width
    let imageY = face.boundingBox.origin.y + local.y * face.boundingBox.height
    return CGPoint(x: imageX * CGFloat(width), y: (1 - imageY) * CGFloat(height))
}

print("slug,width,height,leftX,leftY,rightX,rightY,midX,midY,angle,correction")
for slug in people {
    let filename = pngSources.contains(slug) ? "source.png" : "source.jpg"
    let inputURL = root.appendingPathComponent(slug).appendingPathComponent(filename)
    guard let image = NSImage(contentsOf: inputURL) else { continue }
    var rect = NSRect(origin: .zero, size: image.size)
    guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else { continue }
    let request = VNDetectFaceLandmarksRequest()
    try VNImageRequestHandler(cgImage: cgImage, orientation: .up).perform([request])
    guard let face = request.results?.first,
          let leftEye = face.landmarks?.leftEye,
          let rightEye = face.landmarks?.rightEye else { continue }
    let first = centroid(leftEye, face: face, width: cgImage.width, height: cgImage.height)
    let second = centroid(rightEye, face: face, width: cgImage.width, height: cgImage.height)
    let left = first.x < second.x ? first : second
    let right = first.x < second.x ? second : first
    let mid = CGPoint(x: (left.x + right.x) / 2, y: (left.y + right.y) / 2)
    let angle = atan2(right.y - left.y, right.x - left.x) * 180 / .pi
    print(String(format: "%@,%d,%d,%.3f,%.3f,%.3f,%.3f,%.3f,%.3f,%.3f,%.3f",
                 slug, cgImage.width, cgImage.height, left.x, left.y, right.x, right.y,
                 mid.x, mid.y, angle, -angle))
}
