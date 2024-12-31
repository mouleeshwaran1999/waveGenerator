const fs = require('fs');

// Custom parser for simple VCD format
function parseVcd(vcdContent) {
    const lines = vcdContent.split('\n');
    const jsonOutput = {
        header: {
            date: null,
            version: null,
            timescale: null,
        },
        scopes: [],
        signals: [],
        changes: [],
    };

    let currentScope = null;
    let time = 0;

    lines.forEach((line) => {
        line = line.trim();

        if (line.startsWith('$date')) {
            jsonOutput.header.date = line.replace('$date', '').replace('$end', '').trim();
        } else if (line.startsWith('$version')) {
            jsonOutput.header.version = line.replace('$version', '').replace('$end', '').trim();
        } else if (line.startsWith('$timescale')) {
            jsonOutput.header.timescale = line.replace('$timescale', '').replace('$end', '').trim();
        } else if (line.startsWith('$scope')) {
            const scopeName = line.split(' ')[2];
            const newScope = { name: scopeName, signals: [] };
            if (currentScope) {
                currentScope.signals.push(newScope);
            } else {
                jsonOutput.scopes.push(newScope);
            }
            currentScope = newScope;
        } else if (line.startsWith('$upscope')) {
            currentScope = null;
        } else if (line.startsWith('$var')) {
            const parts = line.split(' ');
            const signal = {
                type: parts[1],
                size: parts[2],
                id: parts[3],
                name: parts.slice(4, parts.length - 1).join(' '),
            };
            jsonOutput.signals.push(signal);
            if (currentScope) {
                currentScope.signals.push(signal);
            }
        } else if (line.startsWith('#')) {
            time = parseInt(line.substring(1), 10);
        } else if (/^[01]/.test(line)) {
            const value = line[0];
            const signalId = line.substring(1);
            jsonOutput.changes.push({ time, signalId, value });
        }
    });

    return jsonOutput;
}

// Read VCD file and convert to JSON
function convertVcdToJson(inputFile, outputFile) {
    try {
        const vcdContent = fs.readFileSync(inputFile, 'utf8');
        const jsonOutput = parseVcd(vcdContent);
        fs.writeFileSync(outputFile, JSON.stringify(jsonOutput, null, 2), 'utf8');
        console.log(`VCD successfully converted to JSON: ${outputFile}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
// const inputFile = './fixed.vcd';
// const outputFile = './output.json';
// convertVcdToJson(inputFile, outputFile);

module.exports = convertVcdToJson;