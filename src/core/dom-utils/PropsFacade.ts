class PropsFacade {
    public static getEventListenersFromProps(props: Record<string, any>): Record<string, any> {
        const events: Record<string, any> = {};
        Object.entries(props).forEach(([key, val]) => {
            if (key.startsWith('on')) {
                const eventName = key.substring(2).toLowerCase();
                events[eventName] = val;
            }
        })
        return events;
    }

    public static setElementAttributes(element: HTMLElement, attributes: Record<string, any> | null) {
        if (!attributes) return;
        Object.entries(attributes).forEach(([key, val]) => {
            if (key.startsWith('on')) {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, val);
            }
            else {
                if (typeof val === 'boolean')
                    (element as any)[key] = val;
                else element.setAttribute(key, val);
            }
        })
    }
}

export default PropsFacade;