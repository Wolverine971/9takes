#!/usr/bin/env swift

import CoreImage
import Foundation
import Vision

enum BackgroundRemovalError: Error, CustomStringConvertible {
    case usage
    case unreadableImage(String)
    case noForeground
    case invalidInstance(Int, [Int])

    var description: String {
        switch self {
        case .usage:
            return "Usage: remove-photo-background.swift <input-image> <output.png> [instance-id]"
        case let .unreadableImage(path):
            return "Could not read image at \(path)"
        case .noForeground:
            return "Vision did not detect a foreground subject"
        case let .invalidInstance(instance, available):
            return "Foreground instance \(instance) was not found; available instances: \(available)"
        }
    }
}

@available(macOS 14.0, *)
func removeBackground(inputPath: String, outputPath: String, instanceID: Int?) throws {
    let inputURL = URL(fileURLWithPath: inputPath)
    let outputURL = URL(fileURLWithPath: outputPath)
    guard let inputImage = CIImage(
        contentsOf: inputURL,
        options: [.applyOrientationProperty: true]
    ) else {
        throw BackgroundRemovalError.unreadableImage(inputPath)
    }

    let request = VNGenerateForegroundInstanceMaskRequest()
    let handler = VNImageRequestHandler(ciImage: inputImage, options: [:])
    try handler.perform([request])

    guard let observation = request.results?.first,
          !observation.allInstances.isEmpty else {
        throw BackgroundRemovalError.noForeground
    }

    let availableInstances = Array(observation.allInstances)
    let selectedInstances: IndexSet
    if let instanceID {
        guard observation.allInstances.contains(instanceID) else {
            throw BackgroundRemovalError.invalidInstance(instanceID, availableInstances)
        }
        selectedInstances = IndexSet(integer: instanceID)
    } else {
        selectedInstances = observation.allInstances
    }
    print("Detected foreground instances: \(availableInstances); selected: \(Array(selectedInstances))")

    let maskBuffer = try observation.generateScaledMaskForImage(
        forInstances: selectedInstances,
        from: handler
    )
    let maskImage = CIImage(cvPixelBuffer: maskBuffer)
    let transparentBackground = CIImage(color: .clear).cropped(to: inputImage.extent)
    let foreground = inputImage.applyingFilter(
        "CIBlendWithMask",
        parameters: [
            kCIInputBackgroundImageKey: transparentBackground,
            kCIInputMaskImageKey: maskImage
        ]
    )

    let context = CIContext(options: [.cacheIntermediates: false])
    let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    try context.writePNGRepresentation(
        of: foreground,
        to: outputURL,
        format: .RGBA8,
        colorSpace: colorSpace
    )
}

do {
    guard CommandLine.arguments.count == 3 || CommandLine.arguments.count == 4 else {
        throw BackgroundRemovalError.usage
    }

    let instanceID: Int?
    if CommandLine.arguments.count == 4 {
        guard let parsedInstance = Int(CommandLine.arguments[3]) else {
            throw BackgroundRemovalError.usage
        }
        instanceID = parsedInstance
    } else {
        instanceID = nil
    }

    if #available(macOS 14.0, *) {
        try removeBackground(
            inputPath: CommandLine.arguments[1],
            outputPath: CommandLine.arguments[2],
            instanceID: instanceID
        )
    } else {
        fputs("This script requires macOS 14 or newer.\n", stderr)
        exit(1)
    }
} catch {
    fputs("\(error)\n", stderr)
    exit(1)
}
