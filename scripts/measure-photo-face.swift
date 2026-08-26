#!/usr/bin/env swift

import CoreImage
import Foundation
import Vision

guard CommandLine.arguments.count == 2 else {
    fputs("Usage: measure-photo-face.swift <image>\n", stderr)
    exit(1)
}

let imagePath = CommandLine.arguments[1]
guard let image = CIImage(
    contentsOf: URL(fileURLWithPath: imagePath),
    options: [.applyOrientationProperty: true]
) else {
    fputs("Could not read image: \(imagePath)\n", stderr)
    exit(1)
}

let request = VNDetectFaceLandmarksRequest()
let handler = VNImageRequestHandler(ciImage: image, options: [:])
try handler.perform([request])

let width = image.extent.width
let height = image.extent.height
let faces = (request.results ?? []).sorted {
    $0.boundingBox.width * $0.boundingBox.height > $1.boundingBox.width * $1.boundingBox.height
}

func pixelPoint(_ point: CGPoint, in face: VNFaceObservation) -> CGPoint {
    let box = face.boundingBox
    let normalizedX = box.origin.x + point.x * box.width
    let normalizedY = box.origin.y + point.y * box.height
    return CGPoint(x: normalizedX * width, y: (1 - normalizedY) * height)
}

func regionCenter(_ region: VNFaceLandmarkRegion2D?, in face: VNFaceObservation) -> CGPoint? {
    guard let region, region.pointCount > 0 else { return nil }
    let points = region.normalizedPoints.map { pixelPoint($0, in: face) }
    return CGPoint(
        x: points.map(\.x).reduce(0, +) / CGFloat(points.count),
        y: points.map(\.y).reduce(0, +) / CGFloat(points.count)
    )
}

var rows: [[String: Any]] = []
for (index, face) in faces.enumerated() {
    let box = face.boundingBox
    let x = box.origin.x * width
    let y = (1 - box.origin.y - box.height) * height
    let boxWidth = box.width * width
    let boxHeight = box.height * height
    let leftEye = regionCenter(face.landmarks?.leftEye, in: face)
    let rightEye = regionCenter(face.landmarks?.rightEye, in: face)
    var row: [String: Any] = [
        "index": index,
        "confidence": face.confidence,
        "box": ["x": x, "y": y, "width": boxWidth, "height": boxHeight],
        "center": ["x": x + boxWidth / 2, "y": y + boxHeight / 2]
    ]
    if let leftEye, let rightEye {
        row["eyes"] = [
            "left": ["x": leftEye.x, "y": leftEye.y],
            "right": ["x": rightEye.x, "y": rightEye.y],
            "center": ["x": (leftEye.x + rightEye.x) / 2, "y": (leftEye.y + rightEye.y) / 2]
        ]
    }
    rows.append(row)
}

let output: [String: Any] = [
    "path": imagePath,
    "width": width,
    "height": height,
    "faces": rows
]
let data = try JSONSerialization.data(withJSONObject: output, options: [.prettyPrinted, .sortedKeys])
print(String(decoding: data, as: UTF8.self))
