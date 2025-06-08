// 配置marked选项
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});

// 存储已上传的文件
let uploadedFiles = [];

// 初始化
function init() {
    // 添加拖放事件监听
    const uploadArea = document.getElementById('upload-area');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('highlight');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('highlight');
        });
    });

    uploadArea.addEventListener('drop', handleDrop);
    document.getElementById('file-input').addEventListener('change', handleFileSelect);
}

// 处理文件拖放
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// 处理文件选择
function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

// 处理文件
function handleFiles(files) {
    [...files].forEach(file => {
        if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                addFileToList(file.name, content);
            };
            reader.readAsText(file);
        }
    });
}

// 添加文件到列表
function addFileToList(filename, content) {
    const fileList = document.getElementById('file-list');
    const fileItem = document.createElement('li');
    fileItem.className = 'file-item';
    fileItem.textContent = filename;
    
    // 存储文件内容
    uploadedFiles.push({
        name: filename,
        content: content
    });
    
    fileItem.addEventListener('click', () => {
        // 移除其他文件的active类
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加active类到当前文件
        fileItem.classList.add('active');
        
        // 显示文件内容
        renderMarkdown(content);
    });
    
    fileList.appendChild(fileItem);
    
    // 自动显示第一个文件的内容
    if (fileList.children.length === 1) {
        fileItem.click();
    }
}

// 渲染Markdown内容
function renderMarkdown(content) {
    const preview = document.getElementById('preview');
    preview.innerHTML = marked.parse(content);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 添加示例内容
document.getElementById('markdown-content').value = `# 欢迎使用Markdown博客！

## 这是一个示例文档

你可以：
- 直接在编辑区域编写Markdown内容
- 上传本地的Markdown文件
- 点击预览按钮查看渲染效果

### 代码示例

\`\`\`javascript
function hello() {
    console.log("Hello, Markdown!");
}
\`\`\`

> 这是一段引用文本

**祝您使用愉快！**
`;

// 初始渲染
renderMarkdown();

// 检测PDF加载状态
window.addEventListener('load', function() {
    const loading = document.querySelector('.loading');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 1500);
}); 