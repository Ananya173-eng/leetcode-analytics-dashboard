import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Book, Bookmark, Calendar, Plus, Trash2, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';

export default function Journal() {
  const { user, addJournalEntry, addBookmark, removeBookmark } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState('journal'); // journal, bookmarks, planner
  
  // Journal Form
  const [journalTitle, setJournalTitle] = useState('');
  const [problemLink, setProblemLink] = useState('');
  const [difficulty, setDifficulty] = useState('None');
  const [notes, setNotes] = useState('');
  const [savingJournal, setSavingJournal] = useState(false);

  // Bookmark Form
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [bookmarkLink, setBookmarkLink] = useState('');
  const [bookmarkDiff, setBookmarkDiff] = useState('Easy');
  const [savingBookmark, setSavingBookmark] = useState(false);

  // Study Planner Calendar State
  const [selectedDay, setSelectedDay] = useState(null);
  const [plannerNotes, setPlannerNotes] = useState({});
  const [tempNotesInput, setTempNotesInput] = useState('');

  const handleAddJournal = async (e) => {
    e.preventDefault();
    if (!journalTitle || !notes) return;
    setSavingJournal(true);
    const res = await addJournalEntry({ title: journalTitle, problemLink, difficulty, notes });
    setSavingJournal(false);
    if (res.success) {
      setJournalTitle('');
      setProblemLink('');
      setDifficulty('None');
      setNotes('');
    }
  };

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!bookmarkTitle || !bookmarkLink) return;
    setSavingBookmark(true);
    const res = await addBookmark({ title: bookmarkTitle, link: bookmarkLink, difficulty: bookmarkDiff });
    setSavingBookmark(false);
    if (res.success) {
      setBookmarkTitle('');
      setBookmarkLink('');
      setBookmarkDiff('Easy');
    }
  };

  const handleDeleteBookmark = async (id) => {
    await removeBookmark(id);
  };

  // Planner handlers
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const savePlannerNote = () => {
    if (selectedDay === null) return;
    setPlannerNotes(prev => ({
      ...prev,
      [selectedDay]: tempNotesInput
    }));
    setTempNotesInput('');
  };

  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-white/5 bg-slate-50/50 dark:bg-black/10">
        {[
          { id: 'journal', name: 'Coding Journal', icon: <Book className="h-4 w-4" /> },
          { id: 'bookmarks', name: 'Bookmarks', icon: <Bookmark className="h-4 w-4" /> },
          { id: 'planner', name: 'Study Planner Calendar', icon: <Calendar className="h-4 w-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? 'border-primary-violet text-primary-violet'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* TAB 1: Coding Journal */}
        {activeSubTab === 'journal' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Journal logger form */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Log Problem Notes</h3>
              <form onSubmit={handleAddJournal} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Problem Title (e.g. 3Sum)"
                  value={journalTitle}
                  onChange={e => setJournalTitle(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Problem URL Link (optional)"
                  value={problemLink}
                  onChange={e => setProblemLink(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none dark:text-white"
                />
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs focus:outline-none dark:text-white"
                >
                  <option value="None">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <textarea
                  required
                  rows="4"
                  placeholder="Key observations, recursive relations, optimal space-time complexities..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none dark:text-white"
                />
                <button
                  type="submit"
                  disabled={savingJournal}
                  className="w-full rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal py-2.5 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  {savingJournal ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Add Entry'}
                </button>
              </form>
            </div>

            {/* List of journal entries */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Journal Entries</h3>
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {user?.journal && user.journal.length > 0 ? (
                  user.journal.map(entry => (
                    <div key={entry._id} className="bg-white/2 border border-white/5 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{entry.title}</span>
                        <div className="flex items-center gap-2">
                          {entry.difficulty !== 'None' && (
                            <span className={`px-1.5 py-0.5 rounded text-4xs font-bold uppercase ${
                              entry.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                              entry.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {entry.difficulty}
                            </span>
                          )}
                          {entry.problemLink && (
                            <a href={entry.problemLink} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                              <LinkIcon className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-3xs text-slate-400 whitespace-pre-wrap leading-relaxed">{entry.notes}</p>
                      <div className="text-5xs text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-3xs text-slate-500 italic">No notes logged yet. Log your solved algorithms analysis here!</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bookmarks */}
        {activeSubTab === 'bookmarks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bookmark form */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Bookmark Challenging Problems</h3>
              <form onSubmit={handleAddBookmark} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="LeetCode Question Name (e.g. Subsets)"
                  value={bookmarkTitle}
                  onChange={e => setBookmarkTitle(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Problem URL Link"
                  value={bookmarkLink}
                  onChange={e => setBookmarkLink(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none dark:text-white"
                />
                <select
                  value={bookmarkDiff}
                  onChange={e => setBookmarkDiff(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs focus:outline-none dark:text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <button
                  type="submit"
                  disabled={savingBookmark}
                  className="w-full rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal py-2.5 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  {savingBookmark ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Bookmark Question'}
                </button>
              </form>
            </div>

            {/* List of bookmarks */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Bookmarked List</h3>
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {user?.bookmarks && user.bookmarks.length > 0 ? (
                  user.bookmarks.map(b => (
                    <div key={b._id} className="bg-white/2 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <a href={b.link} target="_blank" rel="noopener noreferrer" className="font-bold text-xs text-slate-900 dark:text-white hover:text-primary-violet hover:underline flex items-center gap-1.5 truncate">
                          {b.title} <LinkIcon className="h-3 w-3 inline shrink-0" />
                        </a>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-5xs font-bold uppercase mt-1 ${
                          b.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                          b.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {b.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteBookmark(b._id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-3xs text-slate-500 italic">No questions bookmarked for revision yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Study Planner Calendar */}
        {activeSubTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Daily Study Planner Grid</h3>
              <div className="grid grid-cols-7 gap-2.5">
                {daysInMonth.map(day => {
                  const hasNote = !!plannerNotes[day];
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDay(day);
                        setTempNotesInput(plannerNotes[day] || '');
                      }}
                      className={`aspect-square rounded-xl border flex flex-col justify-between p-2 text-left transition-all ${
                        selectedDay === day
                          ? 'bg-primary-violet/10 border-primary-violet text-primary-violet'
                          : hasNote
                          ? 'bg-secondary-teal/10 border-secondary-teal/30 text-secondary-teal hover:border-secondary-teal'
                          : 'bg-white/2 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xs font-extrabold">{day}</span>
                      {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-secondary-teal self-end"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day Scheduler */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Day details</h3>
              {selectedDay !== null ? (
                <div className="bg-white/2 border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Day {selectedDay} Target Schedule</div>
                  
                  {plannerNotes[selectedDay] ? (
                    <div className="text-2xs text-slate-700 dark:text-slate-300 bg-white/2 p-3 rounded-lg border border-white/5">
                      {plannerNotes[selectedDay]}
                    </div>
                  ) : (
                    <div className="text-3xs text-slate-500 italic">No topic scheduled for Day {selectedDay}.</div>
                  )}

                  <textarea
                    rows="3"
                    placeholder="E.g. Study Graph BFS/DFS traversal templates and solve 3 Mediums."
                    value={tempNotesInput}
                    onChange={e => setTempNotesInput(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none dark:text-white"
                  />

                  <button
                    onClick={savePlannerNote}
                    className="w-full rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal py-2 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4 w-4" /> Save Schedule
                  </button>
                </div>
              ) : (
                <div className="text-3xs text-slate-500 italic py-8 text-center border border-dashed border-white/5 rounded-xl">
                  Select a day grid square to outline study target schedules.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
