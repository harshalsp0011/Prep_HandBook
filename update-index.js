const fs = require('fs');
const path = require('path');

// Configuration
const COMPONENTS_DIR = path.join(__dirname, 'components');
const INDEX_FILE = path.join(__dirname, 'index.html');
const ROOT_CATEGORY = 'General';

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

const folderNameToTitle = (folderName) => {
    return folderName
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .filter(Boolean)
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

        const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
        const components = [];

        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const category = folderNameToTitle(entry.name);
                const categoryDir = path.join(COMPONENTS_DIR, entry.name);
                const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.html'));

                files.forEach(file => {
                    components.push({
                        filename: file,
                        path: `components/${entry.name}/${file}`,
                        title: filenameToTitle(file),
                        icon: getIconForComponent(file),
                        description: generateDescription(file),
                        tag: generateTag(file),
                        category
                    });
                });
                return;
            }

            if (entry.isFile() && entry.name.endsWith('.html')) {
                components.push({
                    filename: entry.name,
                    path: `components/${entry.name}`,
                    title: filenameToTitle(entry.name),
                    icon: getIconForComponent(entry.name),
                    description: generateDescription(entry.name),
                    tag: generateTag(entry.name),
                    category: ROOT_CATEGORY
                });
            }
        });

        return components;
    } catch (error) {
        console.error('Error scanning components:', error);
        return [];
    }
};

// Generate card HTML
const generateCardHTML = (component) => {
    return `            <a href="${component.path}" class="card" data-search-content="" data-category="${component.category}">
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

const generateSectionHTML = (category, components) => {
    const cardsHTML = components.map(generateCardHTML).join('\n');
    const countLabel = components.length === 1 ? '1 topic' : `${components.length} topics`;

    return `            <div class="topic-section" data-category="${category}">
                <div class="topic-header">
                    <h3 class="topic-title">${category}</h3>
                    <span class="topic-count">${countLabel}</span>
                </div>
                <div class="cards-grid topic-grid">
${cardsHTML}
                </div>
            </div>`;
};

// Generate sidebar navigation HTML
const generateSidebarHTML = (components) => {
    const grouped = components.reduce((acc, component) => {
        acc[component.category] = acc[component.category] || [];
        acc[component.category].push(component);
        return acc;
    }, {});

    Object.keys(grouped).forEach(category => {
        grouped[category].sort((a, b) => a.title.localeCompare(b.title));
    });

    const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
    
    let sidebarHTML = '';
    sortedCategories.forEach((category, index) => {
        const isFirstFolder = index === 0;
        const expandedClass = isFirstFolder ? 'expanded' : '';
        const filesHTML = grouped[category]
            .map(comp => `                    <li class="sidebar-item">
                        <a class="sidebar-file" data-href="${comp.path}">
                            <span class="sidebar-file-icon">${comp.icon}</span>
                            <span class="sidebar-file-name">${comp.title}</span>
                        </a>
                    </li>`)
            .join('\n');

        sidebarHTML += `            <li class="sidebar-item">
                <div class="sidebar-folder ${expandedClass}">
                    <div class="sidebar-folder-icon">
                        <span class="sidebar-folder-toggle">▶</span>
                        <span>📁 ${category}</span>
                        <span class="folder-count" style="font-size: 0.8em; color: var(--text-light); margin-left: auto;">(${grouped[category].length})</span>
                    </div>
                </div>
                <ul class="sidebar-files">
${filesHTML}
                </ul>
            </li>
`;
    });

    return sidebarHTML;
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

        const grouped = components.reduce((acc, component) => {
            acc[component.category] = acc[component.category] || [];
            acc[component.category].push(component);
            return acc;
        }, {});

        Object.keys(grouped).forEach(category => {
            grouped[category].sort((a, b) => a.title.localeCompare(b.title));
        });

        const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
        const sectionsHTML = sortedCategories
            .map(category => generateSectionHTML(category, grouped[category]))
            .join('\n');

        // Generate and update sidebar
        const sidebarHTML = generateSidebarHTML(components);
        const sidebarRegex = /(<nav id="sidebarNav" class="sidebar-nav">)([\s\S]*?)(<\/nav>)/;
        indexContent = indexContent.replace(
            sidebarRegex,
            `$1\n            <ul style="list-style: none; padding: 0; margin: 0;">\n${sidebarHTML}            </ul>\n        $3`
        );

        // Update sections
        const sectionsRegex = /(<div id="componentsSections">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/;
        indexContent = indexContent.replace(
            sectionsRegex,
            `$1\n                <!-- Sections will be dynamically inserted here -->\n${sectionsHTML}\n            $3`
        );

        // Write updated content back to index.html
        fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');
        
        console.log('\n✅ Index.html updated successfully!');
        console.log(`📊 Total components: ${components.length}`);
        console.log(`📁 Total categories: ${sortedCategories.length}`);
    } catch (error) {
        console.error('❌ Error updating index:', error.message);
        process.exit(1);
    }
};

// Run the update
updateIndex();
