const fs = require('fs');

function convertToWaveDrom(inputFile, outputFile) {
    try {
        const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
        const { signals, changes } = jsonData;

        // Map signal IDs to names
        const signalMap = {};
        signals.forEach(signal => {
            signalMap[signal.id] = signal.name;
        });

        // Organize changes by signal and time
        const signalWaves = {};
        signals.forEach(signal => {
            signalWaves[signal.id] = { name: signal.name, wave: "" };
        });

        const timePoints = Array.from(new Set(changes.map(change => change.time))).sort((a, b) => a - b);

        timePoints.forEach(time => {
            signals.forEach(signal => {
                const change = changes.find(ch => ch.time === time && ch.signalId === signal.id);
                if (change) {
                    signalWaves[signal.id].wave += change.value;
                } else {
                    signalWaves[signal.id].wave += ".";
                }
            });
        });

        const waveDrom = {
            signal: Object.values(signalWaves),
            foot: {
                tock: 10000 // Assume 10,000 ps per time step
            }
        };

        fs.writeFileSync(outputFile, JSON.stringify(waveDrom, null, 2), 'utf8');
        console.log(`WaveDrom JSON written to: ${outputFile}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
// const inputFile = './output.json';
// const outputFile = './wavedrom.json';
// convertToWaveDrom(inputFile, outputFile);

module.exports = convertToWaveDrom;
