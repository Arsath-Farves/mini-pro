const { spawn } = require('child_process');
const path = require('path');

/**
 * Middleware to check content toxicity using AI.
 */
const toxicityChecker = (req, res, next) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required.' });
    }

    const pythonPath = path.join(__dirname, '../../ai-services/venv/Scripts/python.exe');
    const scriptPath = path.join(__dirname, '../../ai-services/moderate.py');

    const pythonProcess = spawn(pythonPath, [scriptPath]);

    let resultData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Moderation script error [${code}]: ${errorData}`);
            // If the model fails to load/run, we can either block or allow.
            // For safety, let's allow but log, unless it's a critical failure.
            return next();
        }

        try {
            const moderation = JSON.parse(resultData);
            if (moderation.toxic) {
                console.log(`🚫 Blocked toxic content: "${content.substring(0, 50)}..." [Score: ${moderation.score}]`);
                return res.status(403).json({
                    message: 'Community Guidelines Violation: Your post contains harmful or toxic language and has been blocked.',
                    type: 'TOXICITY_ALERT'
                });
            }
            next();
        } catch (err) {
            console.error('Failed to parse moderation output:', err);
            next();
        }
    });

    pythonProcess.stdin.write(content);
    pythonProcess.stdin.end();
};

module.exports = toxicityChecker;
