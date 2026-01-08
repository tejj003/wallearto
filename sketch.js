let video;
let prevFrame;
let madness = 0;
let font;
const screamWords = ["WHY", "STOP", "NO", "ERROR", "VOID", "NULL", "???", "RUN"];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    pixelDensity(1);
    
    // Initialize webcam
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    
    frameRate(30);
    noSmooth();
}

function draw() {
    background(0);
    
    // Ensure video is ready
    if (video.loadedmetadata) {
        video.loadPixels();
        
        // Motion Detection Logic
        let currentMotion = 0;
        
        // We only check a smaller sample of pixels for performance
        if (prevFrame) {
            prevFrame.loadPixels();
            
             // Sample every 4th pixel to save CPU
            for (let i = 0; i < video.pixels.length; i += 16) {
                let r1 = video.pixels[i];
                let g1 = video.pixels[i + 1];
                let b1 = video.pixels[i + 2];
                
                let r2 = prevFrame.pixels[i];
                let g2 = prevFrame.pixels[i + 1];
                let b2 = prevFrame.pixels[i + 2];
                
                let diff = dist(r1, g1, b1, r2, g2, b2);
                currentMotion += diff;
            }
        }
        
        // Save current frame for next loop
        // We create a graphics object or image copy to avoid reference issues
        if (!prevFrame) {
            prevFrame = createImage(video.width, video.height);
        }
        prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
        
        // Normalize motion (heuristic value, adjust divisor based on testing)
        // 640*480 pixels / 4 step = 76800 pixels check
        // Max diff per pixel approx 441.
        let normalizedMotion = map(currentMotion, 0, 5000000, 0, 1);
        normalizedMotion = constrain(normalizedMotion, 0, 1);
        
        // Smooth the madness value
        madness = lerp(madness, normalizedMotion * 5, 0.1); // Amplified multiplier
        madness = constrain(madness, 0, 1);
        
        
        // --- DRAWING THE ART --- //
        
        push();
        // Center the video
        translate(width / 2, height / 2);
        // Flip horizontally like a mirror
        scale(-1, 1);
        
        // Scale video to cover screen
        let scaleFactor = max(width / video.width, height / video.height);
        scale(scaleFactor);
        translate(-video.width / 2, -video.height / 2);

        // STATE 1: CALM
        // Just draw the video
        if (madness < 0.2) {
             let breath = map(sin(frameCount * 0.05), -1, 1, 200, 255);
             tint(breath);
             image(video, 0, 0);
        }
        
        // STATE 2: ANNOYED (RGB Shift)
        else if (madness < 0.6) {
            let shake = map(madness, 0.2, 0.6, 5, 20);
            
            // Red Channel
            tint(255, 0, 0, 200);
            image(video, random(-shake, shake), 0);
            
            // Blue Channel
            noTint(); // Reset to allow mix
            tint(0, 0, 255, 200);
            // using blend mode for addition is better but simple tint works for glitch feel
            blendMode(ADD);
            image(video, 0, random(-shake, shake));
            
            // Green/Base
            blendMode(BLEND);
            tint(0, 255, 0, 150);
            image(video, 0, 0);
        }
        
        // STATE 3: ENRAGED (Invert + Distort)
        else {
            let intensity = map(madness, 0.6, 1, 10, 100); // Increased intensity range
            
            // Global Shake for the base image
            let gx = random(-intensity, intensity);
            let gy = random(-intensity, intensity);

            // Draw base inverted with shake
            push();
            translate(gx, gy);
            filter(INVERT);
            filter(THRESHOLD, 0.4);
            image(video, 0, 0);
            pop();
            
            // Slice displacement (Glitch)
            // Increased loop to create more chaos covering the screen
            for (let i = 0; i < 20; i++) { 
                let y = random(video.height);
                let h = random(50, 150); // Larger slices
                let xOffset = random(-intensity * 3, intensity * 3); // Wider displacement
                
                // Copy a slice from video and draw it offset
                let slice = video.get(0, y, video.width, h);
                image(slice, xOffset, y);
            }
            
            // Screaming Color Overlay
            blendMode(DIFFERENCE);
            fill(random(255), 0, 0);
            rect(0, 0, video.width, video.height);
            blendMode(BLEND);

            // Screaming Text (Flashing)
            if (random(1) < 0.3) {
                 let word = random(screamWords);
                 let tx = random(video.width);
                 let ty = random(video.height);
                 push();
                 translate(tx, ty);
                 scale(-1, 1); // Un-mirror the text so it is readable
                 noStroke();
                 fill(random(255), 0, 0);
                 textSize(random(50, 200));
                 textAlign(CENTER, CENTER);
                 text(word, 0, 0);
                 pop();
            }
        }
        
        pop();
        
        // Add "Madness" indicator
        let barWidth = 200;
        let barHeight = 20;
        fill(50);
        rect(width/2 - barWidth/2, height - 50, barWidth, barHeight);
        
        let c = lerpColor(color(0, 255, 0), color(255, 0, 0), madness);
        fill(c);
        rect(width/2 - barWidth/2, height - 50, barWidth * madness, barHeight);
        
        noFill();
        stroke(255);
        rect(width/2 - barWidth/2, height - 50, barWidth, barHeight);
        
        fill(255);
        noStroke();
        textAlign(CENTER);
        text("MOVEMENT LEVEL", width/2, height - 60);

    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}