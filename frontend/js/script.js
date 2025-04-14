document.addEventListener('DOMContentLoaded', function() {
    // Set current time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('current-time').textContent = timeString;
    
    // DOM elements
    const codeInput = document.getElementById('code-input');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearCodeBtn = document.getElementById('clear-code');
    const formatCodeBtn = document.getElementById('format-code');
    const chatMessages = document.getElementById('chat-messages');
    const resultsSection = document.getElementById('results-section');
    const findingsContainer = document.getElementById('findings-container');
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    analyzeBtn.addEventListener('click', analyzeCode);
    clearCodeBtn.addEventListener('click', clearCode);
    formatCodeBtn.addEventListener('click', formatCode);
    
    // Functions
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        chatInput.value = '';
        
        // Show AI is typing
        const typingIndicator = createTypingIndicator();
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate AI response after delay
        setTimeout(() => {
            chatMessages.removeChild(typingIndicator);
            const response = generateAIResponse(message);
            addMessageToChat(response, 'ai');
        }, 1500);
    }
    
    function addMessageToChat(message, sender) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start';
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="ml-auto max-w-xs lg:max-w-md">
                    <div class="bg-blue-600 text-white p-3 rounded-lg">
                        <p>${message}</p>
                    </div>
                    <div class="mt-1 text-xs text-gray-500 text-right">
                        <span>You at ${timeString}</span>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                    <i class="fas fa-shield-alt text-blue-600"></i>
                </div>
                <div class="ml-3 max-w-xs lg:max-w-md">
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <p class="font-medium text-gray-800">CodeGuard AI</p>
                        <p class="text-gray-700 mt-1">${message}</p>
                    </div>
                    <div class="mt-1 text-xs text-gray-500">
                        <span>Today at ${timeString}</span>
                    </div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex items-start';
        typingDiv.innerHTML = `
            <div class="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                <i class="fas fa-shield-alt text-blue-600"></i>
            </div>
            <div class="ml-3">
                <div class="bg-gray-100 p-3 rounded-lg w-32">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                </div>
            </div>
        `;
        return typingDiv;
    }
    
    function generateAIResponse(message) {
        // In a real app, this would call an API
        const responses = [
            "I've analyzed your code and found several security concerns. Let me explain them in detail...",
            "That's a great question about security! Here's what you need to know...",
            "Based on my analysis, your code has potential vulnerabilities that should be addressed...",
            "I recommend following these security best practices for your situation...",
            "The code you shared contains patterns that could lead to security issues. Here's how to fix them..."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    async function analyzeCode() {
        const code = codeInput.value.trim();
        if (!code) {
            addMessageToChat("Please paste some code in the input area first.", 'ai');
            return;
        }
    
        // Show analyzing indicator with a spinning animation
        const analyzingDiv = document.createElement('div');
        analyzingDiv.className = 'flex items-start';
        analyzingDiv.innerHTML = `
            <div class="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                <i class="fas fa-shield-alt text-blue-600"></i>
            </div>
            <div class="ml-3">
                <div class="bg-gray-100 p-3 rounded-lg">
                    <p class="font-medium text-gray-800">CodeGuard AI</p>
                    <div class="mt-2">
                        <div class="flex items-center justify-center">
                            <div class="relative w-32 h-32">
                                <!-- Spinning outer circle -->
                                <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                
                                <!-- Center content -->
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-sm font-medium text-blue-600">Analyzing</div>
                                        <div class="text-xs text-gray-500" id="analyze-status">Detecting language...</div>
                                    </div>
                                </div>
    
                                <!-- Small security icons positioned around the circle -->
                                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full">
                                    <i class="fas fa-code text-gray-600 text-xs"></i>
                                </div>
                                <div class="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full">
                                    <i class="fas fa-search text-gray-600 text-xs"></i>
                                </div>
                                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white p-1 rounded-full">
                                    <i class="fas fa-bug text-gray-600 text-xs"></i>
                                </div>
                                <div class="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full">
                                    <i class="fas fa-shield-alt text-gray-600 text-xs"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(analyzingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Animation to update status text
        const statusElement = analyzingDiv.querySelector('#analyze-status');
        const statusMessages = [
            "Detecting language...",
            "Parsing code structure...",
            "Analyzing security patterns...",
            "Checking for vulnerabilities...",
            "Generating recommendations..."
        ];
        
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            statusIndex = (statusIndex + 1) % statusMessages.length;
            statusElement.textContent = statusMessages[statusIndex];
        }, 1500);
    
        try {
            // Call the backend API
            const response = await fetch("http://127.0.0.1:8000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });
    
            if (!response.ok) {
                throw new Error("Failed to analyze code.");
            }
    
            const data = await response.json();
            
            // Clear the status update interval
            clearInterval(statusInterval);
    
            // Add analysis complete message
            addMessageToChat("Analysis complete! Check the results section below for details.", 'ai');
    
            // Show results section
            resultsSection.classList.remove('hidden');
    
            // Count severity levels
            const severityCounts = {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
            };
    
            // Populate findings
            findingsContainer.innerHTML = '';
            data.findings.forEach(finding => {
                // Increment severity counter
                const severity = finding.severity.toLowerCase();
                if (severityCounts.hasOwnProperty(severity)) {
                    severityCounts[severity]++;
                }
    
                const findingDiv = document.createElement('div');
                findingDiv.className = 'border border-gray-200 rounded-lg overflow-hidden mb-4';
    
                let severityColor = 'bg-blue-100 text-blue-800';
                if (finding.severity === 'high') severityColor = 'bg-orange-100 text-orange-800';
                if (finding.severity === 'medium') severityColor = 'bg-yellow-100 text-yellow-800';
                if (finding.severity === 'critical') severityColor = 'bg-red-100 text-red-800';
    
                findingDiv.innerHTML = `
                    <div class="p-3 ${severityColor} flex justify-between items-center">
                        <h4 class="font-medium">${finding.title}</h4>
                        <span class="text-xs px-2 py-1 ${severityColor.replace('100', '200')} rounded-full capitalize">${finding.severity}</span>
                    </div>
                    <div class="p-4">
                        <div class="mb-3">
                            <p class="text-sm text-gray-700">${finding.description}</p>
                            <p class="text-xs text-gray-500 mt-1">Location: ${finding.location}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <p class="text-xs font-medium text-gray-800 mb-1">Recommendation:</p>
                            <p class="text-sm text-gray-700">${finding.recommendation}</p>
                        </div>
                    </div>
                `;
    
                findingsContainer.appendChild(findingDiv);
            });
    
            // Update severity counts in UI
            document.querySelector('.bg-red-100 .text-xl').textContent = severityCounts.critical;
            document.querySelector('.bg-orange-100 .text-xl').textContent = severityCounts.high;
            document.querySelector('.bg-yellow-100 .text-xl').textContent = severityCounts.medium;
            document.querySelector('.bg-blue-100 .text-xl').textContent = severityCounts.low;
    
        } catch (error) {
            addMessageToChat("Failed to analyze code. Please try again later.", 'ai');
            console.error("Error:", error);
        } finally {
            clearInterval(statusInterval);
            chatMessages.removeChild(analyzingDiv);
        }
    }
    
    function generateMockFindings() {
        findingsContainer.innerHTML = '';
        
        const mockFindings = [
            {
                title: "Potential SQL Injection",
                description: "The code uses string concatenation for SQL queries which could lead to SQL injection vulnerabilities.",
                severity: "high",
                location: "Line 42",
                recommendation: "Use parameterized queries or prepared statements instead of string concatenation."
            },
            {
                title: "Hardcoded Credentials",
                description: "The code contains hardcoded database credentials which is a security risk.",
                severity: "medium",
                location: "Line 15",
                recommendation: "Store credentials in environment variables or a secure configuration file."
            },
            {
                title: "Missing Input Validation",
                description: "User input is used directly without proper validation or sanitization.",
                severity: "medium",
                location: "Line 28",
                recommendation: "Implement proper input validation and sanitize all user-provided data."
            },
            {
                title: "Insecure Random Number Generation",
                description: "The code uses Math.random() for security-sensitive operations which is not cryptographically secure.",
                severity: "low",
                location: "Line 67",
                recommendation: "Use the Web Crypto API for cryptographic operations."
            }
        ];
        
        mockFindings.forEach(finding => {
            const findingDiv = document.createElement('div');
            findingDiv.className = 'border border-gray-200 rounded-lg overflow-hidden';
            
            let severityColor = 'bg-blue-100 text-blue-800';
            if (finding.severity === 'high') severityColor = 'bg-orange-100 text-orange-800';
            if (finding.severity === 'medium') severityColor = 'bg-yellow-100 text-yellow-800';
            if (finding.severity === 'critical') severityColor = 'bg-red-100 text-red-800';
            
            findingDiv.innerHTML = `
                <div class="p-3 ${severityColor} flex justify-between items-center">
                    <h4 class="font-medium">${finding.title}</h4>
                    <span class="text-xs px-2 py-1 ${severityColor.replace('100', '200')} rounded-full capitalize">${finding.severity}</span>
                </div>
                <div class="p-4">
                    <div class="mb-3">
                        <p class="text-sm text-gray-700">${finding.description}</p>
                        <p class="text-xs text-gray-500 mt-1">Location: ${finding.location}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-xs font-medium text-gray-800 mb-1">Recommendation:</p>
                        <p class="text-sm text-gray-700">${finding.recommendation}</p>
                    </div>
                </div>
            `;
            
            findingsContainer.appendChild(findingDiv);
        });
    }
    
    function clearCode() {
        codeInput.value = '';
    }
    
    function formatCode() {
        const code = codeInput.value.trim();
        if (!code) return;
        
        // In a real app, this would use a proper formatter based on language
        try {
            // Simple indentation formatting for demo
            const formatted = code.split('\n').map(line => {
                if (line.trim().endsWith('{') || line.trim().endsWith('(')) {
                    return '    ' + line.trim();
                }
                return line.trim();
            }).join('\n');
            
            codeInput.value = formatted;
        } catch (e) {
            addMessageToChat("Failed to format code. Please check your syntax.", 'ai');
        }
    }
});