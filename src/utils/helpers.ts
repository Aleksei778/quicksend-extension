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
