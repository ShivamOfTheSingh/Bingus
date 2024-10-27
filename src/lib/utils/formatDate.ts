export default function formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
  
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new TypeError('Invalid date');
    }
  
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month}, ${year}`;
  }