export function waitForElement(selector: string, timeout = 100) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const check = () => {
            const element = document.querySelector(selector);

            if (element) {
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`Element ${selector} not found`));
            } else {
                setTimeout(check, timeout);
            }
        }

        check()
    })
}

export function findParentComposeWindow(element: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = element

    while (current) {
        if (
            current.classList.contains("AD") ||
            current.classList.contains("aSt")
        ) {
            return current
        }
        current = current.parentElement
    }

    return null
}
