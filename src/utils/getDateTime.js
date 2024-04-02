function formattedTimeDateStorage() {
    
    // Get the current date
    const currentDate = new Date(); 
    currentDate.setTime(currentDate.getTime() + (2 * 60 * 60 * 1000));

    // Format the date as DD:MM:YYYY
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}:${month}:${year}`;

    // Format the time as HH:MM
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return {currentDate,formattedTime,formattedDate}
}

function formattedTimeDateForStoredValues(time) {
    const timestamp = time;
    
    // Get the current date
    const currentDate = new Date(timestamp); 
    currentDate.setTime(currentDate.getTime() - (2 * 60 * 60 * 1000)); // I had to  minus 1 hour to adjust the time 
    
    // Format the date as DD:MM:YYYY
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}:${month}:${year}`;

    // Format the time as HH:MM
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return {formattedTime,formattedDate}
}


module.exports = { formattedTimeDateStorage, formattedTimeDateForStoredValues,}