const fs = require('fs');
const path = require('path');

// Configuration
const COMPONENTS_DIR = path.join(__dirname, 'components');
const INDEX_FILE = path.join(__dirname, 'index.html');

// Icon mapping based on keywords in filename
const getIconForComponent = (filename) => {
    const lowerName = filename.toLowerCase();
    if (lowerName.includes('spark') || lowerName.includes('performance')) return '⚡';
    if (lowerName.includes('partition') || lowerName.includes('bucket')) return '🔧';
    if (lowerName.includes('data') || lowerName.includes('database')) return '💾';
    if (lowerName.includes('security') || lowerName.includes('auth')) return '🔒';
    if (lowerName.includes('api') || lowerName.includes('rest')) return '🌐';
    if (lowerName.includes('test') || lowerName.includes('qa')) return '🧪';
    if (lowerName.includes('deploy') || lowerName.includes('devops')) return '🚀';
    if (lowerName.includes('design') || lowerName.includes('pattern')) return '🎨';
    if (lowerName.includes('algorithm') || lowerName.includes('structure')) return '🧮';
    if (lowerName.includes('machine') || lowerName.includes('learning') || lowerName.includes('ai')) return '🤖';
    if (lowerName.includes('cloud') || lowerName.includes('aws') || lowerName.includes('azure')) return '☁️';
    if (lowerName.includes('docker') || lowerName.includes('container')) return '🐳';
    return '📄';
};

// Convert filename to readable title
const filenameToTitle = (filename) => {
    return filename
        .replace('.html', '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Generate description based on filename
const generateDescription = (filename) => {
    const lowerName = filename.toLowerCase();
    if (lowerName.includes('performance') && lowerName.includes('spark')) {
        return 'Explore performance optimization techniques and best practices for Apache Spark applications.';
    }
    if (lowerName.includes('partition') || lowerName.includes('bucket')) {
        return 'Learn about data partitioning strategies, bucketing techniques, and partition pruning optimization.';
    }
    return `Comprehensive guide covering ${filenameToTitle(filename).toLowerCase()} concepts and best practices.`;
};

// Generate tag based on filename
const generateTag = (filename) => {
    const lowerName = filename.toLowerCase();
    if (lowerName.includes('spark') || lowerName.includes('performance')) return 'Performance';
    if (lowerName.includes('partition') || lowerName.includes('bucket') || lowerName.includes('data')) return 'Data';
    if (lowerName.includes('security') || lowerName.includes('auth')) return 'Security';
    if (lowerName.includes('api') || lowerName.includes('rest')) return 'API';
    if (lowerName.includes('test') || lowerName.includes('qa')) return 'Testing';
    if (lowerName.includes('deploy') || lowerName.includes('devops')) return 'DevOps';
    if (lowerName.includes('design') || lowerName.includes('pattern')) return 'Design';
    if (lowerName.includes('algorithm') || lowerName.includes('structure')) return 'Algorithms';
    if (lowerName.includes('machine') || lowerName.includes('learning') || lowerName.includes('ai')) return 'ML/AI';
    if (lowerName.includes('cloud') || lowerName.includes('aws') || lowerName.includes('azure')) return 'Cloud';
    if (lowerName.includes('docker') || lowerName.includes('container')) return 'Containers';
    return 'Concept';
};

// Scan components directory for HTML files
const scanComponents = () => {
    try {
        if (!fs.existsSync(COMPONENTS_DIR)) {
            console.log('Components directory not found. Creating it...');
            fs.mkdirSync(COMPONENTS_DIR);
            return [];
        }

        const files = fs.readdirSync(COMPONENTS_DIR);
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        
        return htmlFiles.map(file => ({
            filename: file,
            path: `components/${file}`,
            title: filenameToTitle(file),
            icon: getIconForComponent(file),
            description: generateDescription(file),
            tag: generateTag(file)
        }));
    } catch (error) {
        console.error('Error scanning components:', error);
        return [];
    }
};

// Generate card HTML
const generateCardHTML = (component) => {
    return `            <a href="${component.path}" class="card" data-search-content="">
                <span class="card-icon">${component.icon}</span>
                <div class="card-title">${component.title}</div>
                <p class="card-description">${component.description}</p>
                <div class="card-footer">
                    <span class="card-action">
                        Open Guide <span class="arrow">→</span>
                    </span>
                    <span class="card-tag">${component.tag}</span>
                </div>
            </a>`;
};

// Update index.html
const updateIndex = () => {
    try {
        console.log('Scanning components directory...');
        const components = scanComponents();
        
        if (components.length === 0) {
            console.log('No HTML components found in the components directory.');
            return;
        }

        console.log(`Found ${components.length} component(s):`);
        components.forEach(comp => console.log(`  - ${comp.title}`));

        // Read current index.html
        let indexContent = fs.readFileSync(INDEX_FILE, 'utf8');

        // Generate all cards HTML
        const cardsHTML = components.map(generateCardHTML).join('\n');

        // Replace the cards grid content
        const cardsGridRegex = /(<div class="cards-grid" id="componentsGrid">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/;
        indexContent = indexContent.replace(
            cardsGridRegex,
            `$1\n                <!-- Cards will be dynamically inserted here -->\n${cardsHTML}\n            $3`
        );

        // Write updated content back to index.html
        fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');
        
        console.log('\n✅ Index.html updated successfully!');
        console.log(`📊 Total components: ${components.length}`);
    } catch (error) {
        console.error('❌ Error updating index:', error.message);
        process.exit(1);
    }
};

// Run the update
updateIndex();
