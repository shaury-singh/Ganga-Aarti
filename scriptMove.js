class Counter {
    constructor(element, endValue, duration) {
        this.element = element;
        this.endValue = endValue;
        this.duration = duration;
        this.startValue = 0;
        this.startTime = null;
        this.observer = new IntersectionObserver(this.handleIntersect.bind(this));
        this.observer.observe(this.element);
    }
    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animate();
                this.observer.disconnect();
            }
        });
    }
    animate() {
        requestAnimationFrame(this.step.bind(this));
    }
    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const progress = timestamp - this.startTime;
        const value = Math.min(Math.floor((progress / this.duration) * this.endValue), this.endValue);
        this.element.textContent = value.toLocaleString();
        if (progress < this.duration) {
            requestAnimationFrame(this.step.bind(this));
        } else {
            this.element.textContent = this.endValue.toLocaleString();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('#counter');
    counters.forEach(counter => {
        const endValue = parseInt(counter.getAttribute('data-count'), 10);
        new Counter(counter, endValue, 500);
    });
});