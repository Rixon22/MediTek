import swal from 'sweetalert2'

class SuccessHandler {
    constructor(title = '', text = '') {
        this.title = title;
        this.text = text;
    }

    setTitle(title) {
        this.title = title;
    }

    setText(text) {
        this.text = text;
    }

    show() {
        swal.fire({
            title: this.title,
            text: this.text,
            icon: 'success', customClass: {
                container: 'swal2-high-zindex',
            },
        });
    }
}

export default SuccessHandler;