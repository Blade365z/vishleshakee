
//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};
export const updatePasswordAPI = async (oldPassword, newPassword, confirmPassword) => {
    let response = await fetch('updatePasswordSmat', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            oldPassword, newPassword, confirmPassword
        })
    })
    let data = await response.json();
    return data;
}