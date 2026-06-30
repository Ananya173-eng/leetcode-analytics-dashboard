/**
 * Local AI Analytics and Insights Generator
 * Analyzes LeetCode statistics to provide recommendations, plans, and predictions.
 */

export function generateInsightsAndPredictions(stats) {
  const {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    contestRating,
    tagSolvedCount = [],
    submissionCalendar = {},
    acceptanceRate
  } = stats;

  // 1. Calculate Interview Readiness Score
  // Hard questions count for much more, medium counts heavily, easy has a smaller weight.
  const weightedScore = (easySolved * 0.2) + (mediumSolved * 0.7) + (hardSolved * 1.5);
  // Target benchmark: 100 easy, 150 medium, 30 hard = 20 + 105 + 45 = 170
  let interviewReadinessScore = Math.min(99, Math.round((weightedScore / 160) * 100));
  if (interviewReadinessScore < 10) interviewReadinessScore = 15; // baseline

  // 2. Identify Weak Topics
  // Compare standard categories. If solved count is low relative to Array/String, mark as weak.
  const tagMap = {};
  tagSolvedCount.forEach(t => {
    tagMap[t.tagName.toLowerCase()] = t.solvedCount;
  });

  const criticalTopics = [
    { name: 'Dynamic Programming', slug: 'dynamic programming' },
    { name: 'Graphs', slug: 'graph' },
    { name: 'Trees', slug: 'tree' },
    { name: 'Greedy', slug: 'greedy' },
    { name: 'Sliding Window', slug: 'sliding window' },
    { name: 'Binary Search', slug: 'binary search' },
    { name: 'Backtracking', slug: 'backtracking' }
  ];

  // Default weak topics if no tags exist
  let weakTopics = [];
  if (tagSolvedCount.length === 0) {
    weakTopics = ['Dynamic Programming', 'Graphs', 'Binary Search'];
  } else {
    // Find highest solved tags (typically Array/String)
    const arrayCount = tagMap['array'] || 20;
    
    criticalTopics.forEach(topic => {
      const solved = tagMap[topic.slug] || 0;
      // If solved count is less than 35% of array solved count, it's flagged as weak
      if (solved < arrayCount * 0.35 || solved < 5) {
        weakTopics.push(topic.name);
      }
    });

    if (weakTopics.length === 0) {
      // Fallback/Safety check: sort and pick the lowest solved critical topics
      const sortedCritical = criticalTopics
        .map(t => ({ name: t.name, count: tagMap[t.slug] || 0 }))
        .sort((a, b) => a.count - b.count);
      weakTopics = sortedCritical.slice(0, 2).map(t => t.name);
    }
  }

  // Limit weak topics to 3 items
  weakTopics = weakTopics.slice(0, 3);

  // 3. Performance Summary
  let performanceSummary = '';
  if (totalSolved < 50) {
    performanceSummary = `You are starting your LeetCode journey. Currently, you have solved ${totalSolved} problems, focusing mostly on foundational concepts. To build strong analytical skills, try to solve at least 2 Medium problems weekly and ensure you understand basic data structures like Hash Maps and Linked Lists.`;
  } else if (totalSolved < 150) {
    performanceSummary = `You have built a solid foundation with ${totalSolved} solved problems. Your acceptance rate is ${acceptanceRate}%. You are comfortable with Arrays and Strings, but are now transitioning into advanced algorithms. Focus on improving your success rate on Medium problems and practice structural topics like Binary Trees and Breadth-First Search.`;
  } else {
    performanceSummary = `Excellent progress! With ${totalSolved} solved problems (including ${hardSolved} Hard and ${mediumSolved} Medium), you show strong analytical consistency. Your coding profile exhibits robust familiarity with multiple algorithmic classes. Working on complex optimization problems (e.g., Advanced DP, Segment Trees, and Graph flow) will polish your skills.`;
  }

  // 4. Contest Improvement Tips
  const contestImprovementTips = [];
  if (contestRating === 0) {
    contestImprovementTips.push('Participate in your first LeetCode Weekly Contest to benchmark your speed under pressure.');
    contestImprovementTips.push('Contests reward quick, clean implementations. Practice solving Easy problems in under 15 minutes.');
    contestImprovementTips.push('Do virtual contests of past editions to get comfortable with the timer UI.');
  } else if (contestRating < 1600) {
    contestImprovementTips.push('Focus heavily on solving the first 2 questions (Q1 and Q2) consistently without penalties.');
    contestImprovementTips.push('Debug code locally or mentally before submitting to avoid the 5-minute penalty per incorrect submission.');
    contestImprovementTips.push('Examine other coders\' solutions after contests, particularly for Q2, to learn cleaner implementation styles.');
  } else if (contestRating < 1900) {
    contestImprovementTips.push('Q3 (typically Medium/Hard) is your path to Knight rank. Work on standard DFS/BFS/DP templates.');
    contestImprovementTips.push('If stuck on Q3, do not spend the entire contest on it. Ensure Q1 and Q2 are completely optimal first.');
    contestImprovementTips.push('Improve your contest rating by participating regularly; consistency helps normalize performance fluctuations.');
  } else {
    contestImprovementTips.push('Aim to solve Q4 consistently by mastering advanced topics (e.g., Segment Trees, Bitmask DP, Tarjan\'s).');
    contestImprovementTips.push('Focus on speed. Top rankings require completing Q1-Q3 in under 20-30 minutes.');
    contestImprovementTips.push('Analyze complex test constraints to determine if an O(N log N) or O(N) solution is required.');
  }

  // 5. Practice Plan
  const personalizedPracticePlan = [];
  if (weakTopics.length > 0) {
    personalizedPracticePlan.push(`Phase 1 (Days 1-7): Focus on ${weakTopics[0]}. Solve 5 Easy and 5 Medium problems focusing on standard techniques.`);
    if (weakTopics[1]) {
      personalizedPracticePlan.push(`Phase 2 (Days 8-14): Strengthen your ${weakTopics[1]} skills. Focus on recursion, iteration, and space optimizations.`);
    } else {
      personalizedPracticePlan.push(`Phase 2 (Days 8-14): Revisit recursion templates and backtracking techniques to tackle medium-difficulty puzzles.`);
    }
    personalizedPracticePlan.push('Phase 3 (Days 15-21): Conduct mixed review. Practice weekly contest archives, completing Q1-Q3 under time constraints.');
    personalizedPracticePlan.push('Phase 4 (Days 22-30): Interview prep simulations. Perform mock assessments containing randomized Medium/Hard questions.');
  } else {
    personalizedPracticePlan.push('Phase 1 (Days 1-7): Deep dive into Tree traversals and Graph algorithms.');
    personalizedPracticePlan.push('Phase 2 (Days 8-14): Focus on Dynamic Programming optimization (space minimization).');
    personalizedPracticePlan.push('Phase 3 (Days 15-30): Solve 3 Medium problems daily and attend every Weekly Contest.');
  }

  // 6. Consistency Forecast
  // Count active days in the past 30 days
  const todaySeconds = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = todaySeconds - (30 * 86400);
  let activeDaysLastMonth = 0;
  
  Object.keys(submissionCalendar).forEach(ts => {
    const timestamp = parseInt(ts);
    if (timestamp >= thirtyDaysAgo) {
      activeDaysLastMonth++;
    }
  });

  let consistencyForecast = 'Moderate';
  if (activeDaysLastMonth > 20) {
    consistencyForecast = 'High - High likelihood of keeping your active streak going next month!';
  } else if (activeDaysLastMonth > 8) {
    consistencyForecast = 'Steady - Regular activity, but could be increased to build muscle memory.';
  } else {
    consistencyForecast = 'Lacking - Consistent daily practice (even 1 easy problem) is highly recommended.';
  }

  // 7. Predictions
  const predictedRating = contestRating > 0
    ? Math.round(contestRating + (activeDaysLastMonth * 2.5) + (easySolved * 0.1 + mediumSolved * 0.4 + hardSolved * 0.9))
    : Math.round(1450 + (easySolved * 0.8 + mediumSolved * 1.5));

  const monthlyGrowthPrediction = activeDaysLastMonth > 0
    ? Math.round((activeDaysLastMonth / 30) * 45) // solved count expectation
    : 10;

  return {
    aiInsights: {
      performanceSummary,
      weakTopicSuggestions: weakTopics,
      contestImprovementTips,
      personalizedPracticePlan,
      lastGenerated: new Date()
    },
    predictions: {
      predictedRating,
      interviewReadinessScore,
      consistencyForecast,
      monthlyGrowthPrediction
    }
  };
}
