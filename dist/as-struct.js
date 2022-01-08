import { createLRStruct } from '@ddu6/stui';
export function createNamedElement(name, element) {
    const line = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = name;
    line.append(label);
    line.append(element);
    return line;
}
export function createASStruct() {
    const { element, main, sideContent } = createLRStruct();
    const article = document.createElement('article');
    const panel = document.createElement('div');
    const settings = document.createElement('details');
    const summary = document.createElement('summary');
    const colorScheme = document.createElement('select');
    const fontSize = document.createElement('select');
    summary.textContent = 'Settings';
    colorScheme.innerHTML = '<option>auto</option><option>dark</option><option>light</option>';
    fontSize.innerHTML = '<option>small</option><option>medium</option><option>large</option>';
    main.append(article);
    sideContent.append(panel);
    panel.append(settings);
    settings.append(summary);
    settings.append(createNamedElement('Color Scheme', colorScheme));
    settings.append(createNamedElement('Font Size', fontSize));
    document.documentElement.dataset.colorScheme
        = colorScheme.value
            = localStorage.getItem('st-color-scheme')
                ?? document.documentElement.dataset.colorScheme
                ?? 'auto';
    document.documentElement.dataset.fontSize
        = fontSize.value
            = localStorage.getItem('st-font-size')
                ?? document.documentElement.dataset.fontSize
                ?? 'small';
    colorScheme.addEventListener('change', () => {
        localStorage.setItem('st-color-scheme', document.documentElement.dataset.colorScheme = colorScheme.value);
    });
    fontSize.addEventListener('change', () => {
        localStorage.setItem('st-font-size', document.documentElement.dataset.fontSize = fontSize.value);
    });
    return {
        element,
        main,
        sideContent,
        article,
        panel,
        settings,
    };
}
