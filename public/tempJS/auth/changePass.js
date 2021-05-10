import { displayErrorMsg } from '../utilitiesJS/smatExtras.js';
import { updatePasswordAPI } from './helper.js';

_MODE = 'PROJECT';
$('body').on('submit', '#changePassForm', function (e) {
    e.preventDefault();
    let oldPassword = $('#old-password').val().trim();
    let newPassword = $('#new-password').val().trim();
    let confirmPassword = $('#confirm-password').val().trim();
    updatePasswordAPI(oldPassword, newPassword, confirmPassword).then(response => {
        if (response.error) {
            //do somethinf
            //password-change-messages
            displayErrorMsg('password-change-messages', 'error', response.error);

        } else if (response.success) {
            displayErrorMsg('password-change-messages', 'success', response.success);
        }
    })
});