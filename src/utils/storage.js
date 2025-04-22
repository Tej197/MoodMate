export const saveEntry = (entry) => {
    const entries = getEntries();
    entries.push(entry);
    localStorage.setItem('moodJournalEntries', JSON.stringify(entries));
  };
  
  export const getEntries = () => {
    const entries = localStorage.getItem('moodJournalEntries');
    return entries ? JSON.parse(entries) : [];
  };
  
  export const getEntryByDate = (date) => {
    const entries = getEntries();
    return entries.find(entry => {
      const entryDate = new Date(entry.date).toDateString();
      return entryDate === new Date(date).toDateString();
    });
  };
  
  export const getEntriesByMood = (mood) => {
    const entries = getEntries();
    return entries.filter(entry => entry.mood === mood);
  };