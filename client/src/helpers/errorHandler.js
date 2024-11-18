import swal from 'sweetalert2';

export default function ShowError(error) {
    console.error(error)
    let errorMessage;
    if (error.response) {
        if (error.response.data.error) {
            errorMessage = error.response.data.error;
        } else {
            errorMessage = error.response.data.message;
        }
    } else if (error.request) {
        errorMessage = error.request;
    } else {
        errorMessage = error.message;
    }
    swal.fire({
        title: "¡Error!",
        text: errorMessage,
        icon: "error"
    });
}