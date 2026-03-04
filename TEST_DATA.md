# 🧪 Test Data for Lunara Period Tracker

## 📋 Test Scenario 1: Calendar Date Display Fix

### Test Steps:
1. Open `http://localhost:5173`
2. Register/Login with test account
3. Go to "Cycle Tracking" page
4. Click on calendar date: **February 15, 2024**
5. **Expected Result**: Form should show **February 15, 2024** (NOT February 14)

### Test Data:
```
Date to Click: February 15, 2024
Expected in Form: 2024-02-15
```

---

## 📋 Test Scenario 2: Dynamic Cycle Prediction (27-day cycle)

### User Profile: Regular 27-day cycle

### Cycle 1:
```
Start Date: January 12, 2024
Period Length: 5 days
Flow: Medium
Symptoms: Cramps, Fatigue
```

### Cycle 2:
```
Start Date: February 8, 2024
Period Length: 5 days
Flow: Medium
Symptoms: Headache, Bloating
```

### Expected Prediction After Cycle 2:
```
Cycle Length Calculated: 27 days (Feb 8 - Jan 12)
Next Period Date: March 6, 2024 (Feb 8 + 27 days)
Ovulation Date: February 21, 2024 (March 6 - 14 days)
Fertile Window: February 16-22, 2024
```

### Cycle 3 (to verify):
```
Start Date: March 6, 2024
Period Length: 5 days
Flow: Heavy
Symptoms: Cramps, Mood Swings
```

### Expected Prediction After Cycle 3:
```
Average Cycle Length: 27 days (average of 27, 27)
Next Period Date: April 2, 2024 (March 6 + 27 days)
```

---

## 📋 Test Scenario 3: Irregular Cycle (varying lengths)

### User Profile: Irregular cycle

### Cycle 1:
```
Start Date: January 10, 2024
Period Length: 4 days
Flow: Light
Symptoms: Fatigue
```

### Cycle 2:
```
Start Date: February 8, 2024
Period Length: 6 days
Flow: Heavy
Symptoms: Cramps, Headache, Bloating
```

### Expected After Cycle 2:
```
Cycle Length: 29 days (Feb 8 - Jan 10)
Next Period: March 8, 2024 (Feb 8 + 29 days)
```

### Cycle 3:
```
Start Date: March 5, 2024
Period Length: 5 days
Flow: Medium
Symptoms: Mood Swings, Acne
```

### Expected After Cycle 3:
```
Cycle Lengths: 29 days, 26 days
Average: 27.5 days (rounded to 28)
Next Period: April 2, 2024 (March 5 + 28 days)
```

### Cycle 4:
```
Start Date: April 3, 2024
Period Length: 5 days
Flow: Medium
Symptoms: Cramps, Fatigue
```

### Expected After Cycle 4:
```
Recent Cycles: 29, 26, 29 days
Average of last 3: 28 days
Next Period: May 1, 2024 (April 3 + 28 days)
```

---

## 📋 Test Scenario 4: Short Cycle (24-day cycle)

### Cycle 1:
```
Start Date: January 15, 2024
Period Length: 4 days
Flow: Light
Symptoms: None
```

### Cycle 2:
```
Start Date: February 8, 2024
Period Length: 4 days
Flow: Light
Symptoms: Fatigue
```

### Expected:
```
Cycle Length: 24 days (Feb 8 - Jan 15)
Next Period: March 3, 2024 (Feb 8 + 24 days)
```

---

## 📋 Test Scenario 5: Long Cycle (35-day cycle)

### Cycle 1:
```
Start Date: January 5, 2024
Period Length: 6 days
Flow: Heavy
Symptoms: Cramps, Bloating, Mood Swings
```

### Cycle 2:
```
Start Date: February 9, 2024
Period Length: 6 days
Flow: Heavy
Symptoms: Cramps, Headache, Fatigue
```

### Expected:
```
Cycle Length: 35 days (Feb 9 - Jan 5)
Next Period: March 15, 2024 (Feb 9 + 35 days)
Ovulation: March 1, 2024 (March 15 - 14 days)
```

---

## 🎯 Quick Test Data (Copy-Paste Ready)

### Test User 1: Regular Cycle
```
Email: test1@lunara.com
Password: test123

Cycle 1: Jan 12, 2024 | 5 days | Medium | Cramps
Cycle 2: Feb 8, 2024 | 5 days | Medium | Headache
Expected Next: March 6, 2024 (27-day cycle)
```

### Test User 2: Irregular Cycle
```
Email: test2@lunara.com
Password: test123

Cycle 1: Jan 10, 2024 | 4 days | Light | Fatigue
Cycle 2: Feb 8, 2024 | 6 days | Heavy | Cramps, Bloating
Cycle 3: Mar 5, 2024 | 5 days | Medium | Mood Swings
Expected Next: April 2, 2024 (28-day average)
```

### Test User 3: Short Cycle
```
Email: test3@lunara.com
Password: test123

Cycle 1: Jan 15, 2024 | 4 days | Light
Cycle 2: Feb 8, 2024 | 4 days | Light
Expected Next: March 3, 2024 (24-day cycle)
```

---

## ✅ Verification Checklist

### Date Display Test:
- [ ] Click Feb 15 on calendar
- [ ] Form shows Feb 15 (not Feb 14)
- [ ] Submit and verify in cycle history
- [ ] Check calendar shows correct date

### Prediction Test (27-day cycle):
- [ ] Log Cycle 1: Jan 12
- [ ] Log Cycle 2: Feb 8
- [ ] Dashboard shows "Next Period: March 6" (not March 8)
- [ ] Days until period calculated correctly
- [ ] Log Cycle 3: March 6
- [ ] Prediction updates to April 2

### Prediction Test (Irregular):
- [ ] Log 3 cycles with different lengths
- [ ] System calculates average correctly
- [ ] Prediction uses recent cycles (not all-time)
- [ ] Updates after each new cycle

### Edge Cases:
- [ ] First cycle only: Uses 28-day default
- [ ] Very short cycle (20 days): Accepted
- [ ] Very long cycle (45 days): Accepted
- [ ] Invalid cycle (>45 days): Rejected

---

## 🔍 What to Check in Dashboard

After logging cycles, verify:

1. **Next Period Date**: Should match calculated date
2. **Days Until Period**: Should be accurate countdown
3. **Average Cycle Length**: Should show calculated average
4. **Ovulation Date**: Should be 14 days before next period
5. **Fertile Window**: Should be 5 days before to 1 day after ovulation

---

## 📊 Expected Calculations

### Formula:
```
Cycle Length = Current Period Start - Previous Period Start
Average = Sum of last 2-3 cycle lengths / Count
Next Period = Last Period Start + Average Cycle Length
Ovulation = Next Period - 14 days
Fertile Start = Ovulation - 5 days
Fertile End = Ovulation + 1 day
```

### Example:
```
Jan 12 → Feb 8 = 27 days
Feb 8 → Mar 6 = 27 days
Average = (27 + 27) / 2 = 27 days
Next = Mar 6 + 27 = April 2
```

---

## 🐛 Common Issues to Watch For

### Issue: Date shows wrong day
- **Cause**: Browser timezone
- **Fix**: Already fixed with local date handling
- **Test**: Click Feb 15, should show Feb 15

### Issue: Prediction shows 28 days always
- **Cause**: Not calculating from actual data
- **Fix**: Already fixed with dynamic calculation
- **Test**: Log 27-day cycle, should predict 27 days

### Issue: Prediction doesn't update
- **Cause**: Not recalculating after new cycle
- **Fix**: Already fixed with fetchCycles after add
- **Test**: Add new cycle, prediction should update immediately

---

## 💡 Testing Tips

1. **Use Chrome DevTools**: 
   - F12 → Console to see any errors
   - Network tab to see API calls

2. **Check Predictions Card**:
   - Should show "Next Period: [Date]"
   - Should show "Days Until: X days"
   - Should show "Average Cycle: X days"

3. **Verify Calendar**:
   - Pink solid = logged period
   - Pink dashed = predicted period
   - Green = fertile window

4. **Test Cycle Detection Modal**:
   - Click "Cycle Detection" card
   - Check "Cycle Length Analysis" section
   - Verify average cycle length matches

---

## 🎬 Step-by-Step Test Flow

1. **Register**: Create account `test@lunara.com` / `test123`
2. **Log Cycle 1**: Jan 12, 2024
3. **Check Dashboard**: Should show default 28-day prediction
4. **Log Cycle 2**: Feb 8, 2024
5. **Check Dashboard**: Should now show March 6 (27-day cycle)
6. **Click Calendar**: Click Feb 15
7. **Verify Form**: Should show Feb 15
8. **Log Cycle 3**: March 6, 2024
9. **Check Dashboard**: Should show April 2
10. **Open Cycle Detection**: Verify average = 27 days

---

## ✨ Success Criteria

✅ Calendar dates match form dates (no timezone shift)
✅ Predictions use actual cycle length (not fixed 28)
✅ Predictions update after each new cycle
✅ System adapts to user's unique pattern
✅ Ovulation calculated correctly (14 days before)
✅ Fertile window calculated correctly (7-day window)

---

## 📋 Test Scenario 6: Mood Tracking & PMS Prediction

### User Profile: Regular mood patterns before period

### Cycle 1 with Moods:
```
Cycle Start: January 12, 2024
Period Length: 5 days
Flow: Medium

Mood Logs:
- Jan 7 (5 days before): Anxious, Symptoms: Headache, Irritability
- Jan 8 (4 days before): Irritable, Symptoms: Bloating, Fatigue
- Jan 9 (3 days before): Sad, Symptoms: Cramps, Mood Swings
- Jan 10 (2 days before): Anxious, Symptoms: Fatigue
- Jan 11 (1 day before): Tired, Symptoms: Headache
```

### Cycle 2 with Moods:
```
Cycle Start: February 8, 2024
Period Length: 5 days
Flow: Medium

Mood Logs:
- Feb 3 (5 days before): Anxious, Symptoms: Headache, Irritability
- Feb 4 (4 days before): Irritable, Symptoms: Bloating
- Feb 5 (3 days before): Anxious, Symptoms: Mood Swings, Fatigue
- Feb 6 (2 days before): Sad, Symptoms: Cramps
- Feb 7 (1 day before): Tired, Symptoms: Headache, Fatigue
```

### Expected PMS Prediction After Cycle 2:
```
Cycles Analyzed: 2
PMS Window: 5 days before period
Recurring Moods:
  - Anxious: 100% (appeared in 2/2 cycles)
  - Irritable: 100% (appeared in 2/2 cycles)
  - Tired: 100% (appeared in 2/2 cycles)
  - Sad: 100% (appeared in 2/2 cycles)

Recurring Symptoms:
  - Headache: 100%
  - Fatigue: 100%
  - Bloating: 100%

Next PMS Window: March 1-5, 2024 (5 days before March 6)
Notification: Should trigger 1-2 days before (March 4-5)
```

### Cycle 3 with Moods:
```
Cycle Start: March 6, 2024
Period Length: 5 days
Flow: Heavy

Mood Logs:
- Mar 1 (5 days before): Anxious, Symptoms: Headache
- Mar 2 (4 days before): Irritable, Symptoms: Bloating, Mood Swings
- Mar 3 (3 days before): Anxious, Symptoms: Fatigue
- Mar 4 (2 days before): Sad, Symptoms: Cramps, Headache
- Mar 5 (1 day before): Tired, Symptoms: Fatigue
```

### Expected After Cycle 3:
```
Cycles Analyzed: 3
Pattern Consistency: 100% (all moods recurring)
Next PMS Window: March 28 - April 1, 2024
Confidence: High (3+ cycles analyzed)
```

---

## 📋 Test Scenario 7: Partial PMS Pattern (60% threshold)

### Cycle 1:
```
Start: January 15, 2024
Moods (5 days before):
- Jan 10: Happy, Symptoms: None
- Jan 11: Calm, Symptoms: None
- Jan 12: Anxious, Symptoms: Headache
- Jan 13: Irritable, Symptoms: Bloating
- Jan 14: Tired, Symptoms: Fatigue
```

### Cycle 2:
```
Start: February 12, 2024
Moods (5 days before):
- Feb 7: Energetic, Symptoms: None
- Feb 8: Calm, Symptoms: None
- Feb 9: Anxious, Symptoms: Headache
- Feb 10: Irritable, Symptoms: Mood Swings
- Feb 11: Sad, Symptoms: Cramps
```

### Cycle 3:
```
Start: March 10, 2024
Moods (5 days before):
- Mar 5: Happy, Symptoms: None
- Mar 6: Anxious, Symptoms: Headache
- Mar 7: Irritable, Symptoms: Bloating
- Mar 8: Tired, Symptoms: Fatigue
- Mar 9: Calm, Symptoms: None
```

### Expected PMS Prediction:
```
Cycles Analyzed: 3
Recurring Moods (60%+ threshold):
  - Anxious: 100% (3/3 cycles) ✅
  - Irritable: 100% (3/3 cycles) ✅
  - Tired: 67% (2/3 cycles) ✅

Non-Recurring (below 60%):
  - Happy: 33% (1/3 cycles) ❌
  - Calm: 33% (1/3 cycles) ❌
  - Sad: 33% (1/3 cycles) ❌

Recurring Symptoms:
  - Headache: 100% ✅
  - Bloating: 67% ✅
  - Fatigue: 67% ✅

Prediction: "You typically feel anxious and irritable 3-5 days before your period"
```

---

## 📋 Test Scenario 8: No PMS Pattern Detected

### Cycle 1:
```
Start: January 20, 2024
Moods: Happy, Energetic, Calm (no negative moods)
```

### Cycle 2:
```
Start: February 18, 2024
Moods: Calm, Happy, Energetic (no negative moods)
```

### Expected:
```
Cycles Analyzed: 2
Recurring Patterns: None detected
Message: "No consistent PMS patterns detected yet. Keep tracking!"
```

---

## 🧪 Complete Application Test Suite

### 1. AUTHENTICATION TESTS

#### TC-AUTH-001: User Registration
```
Input:
  Name: Test User
  Email: testuser@lunara.com
  Password: test123

Expected:
  ✅ Account created successfully
  ✅ JWT token generated
  ✅ Redirected to dashboard
  ✅ User data stored in MongoDB
```

#### TC-AUTH-002: User Login
```
Input:
  Email: testuser@lunara.com
  Password: test123

Expected:
  ✅ Login successful
  ✅ Token stored in localStorage
  ✅ Redirected to dashboard
  ✅ User data loaded
```

#### TC-AUTH-003: Invalid Login
```
Input:
  Email: testuser@lunara.com
  Password: wrongpassword

Expected:
  ❌ Error: "Incorrect email or password"
  ❌ Not logged in
  ❌ Stays on login page
```

#### TC-AUTH-004: Duplicate Email Registration
```
Input:
  Email: testuser@lunara.com (already exists)

Expected:
  ❌ Error: "An account with this email already exists"
  ❌ Link to login page shown
```

#### TC-AUTH-005: Logout
```
Action: Click logout

Expected:
  ✅ Token removed from localStorage
  ✅ User data cleared
  ✅ Redirected to home page
  ✅ Protected routes inaccessible
```

---

### 2. CYCLE TRACKING TESTS

#### TC-CYCLE-001: Log First Cycle
```
Input:
  Start Date: January 12, 2024
  Period Length: 5 days
  Flow: Medium
  Symptoms: Cramps, Fatigue

Expected:
  ✅ Cycle saved to database
  ✅ Shows in cycle history
  ✅ Calendar shows pink dot on Jan 12-16
  ✅ Default 28-day prediction shown
  ✅ Next period: February 9, 2024
```

#### TC-CYCLE-002: Log Second Cycle (Dynamic Prediction)
```
Input:
  Start Date: February 8, 2024
  Period Length: 5 days
  Flow: Medium

Expected:
  ✅ Cycle saved
  ✅ Cycle length calculated: 27 days
  ✅ Prediction updated to March 6 (not March 8)
  ✅ Average cycle length: 27 days
  ✅ Dashboard shows updated prediction
```

#### TC-CYCLE-003: Calendar Date Click
```
Action: Click February 15 on calendar

Expected:
  ✅ Modal opens
  ✅ Form shows February 15 (not February 14)
  ✅ Date field pre-filled: 2024-02-15
  ✅ No timezone shift
```

#### TC-CYCLE-004: Edit Cycle
```
Action: Edit existing cycle
Changes: Flow from Medium to Heavy

Expected:
  ✅ Cycle updated in database
  ✅ Changes reflected in history
  ✅ Predictions recalculated
```

#### TC-CYCLE-005: Delete Cycle
```
Action: Delete a cycle

Expected:
  ✅ Cycle removed from database
  ✅ Removed from history
  ✅ Calendar updated
  ✅ Predictions recalculated
```

#### TC-CYCLE-006: Invalid Date Entry
```
Input:
  Start Date: February 8, 2024
  End Date: February 5, 2024 (before start)

Expected:
  ❌ Error: "End date must be after start date"
  ❌ Form not submitted
```

#### TC-CYCLE-007: Period Length Validation
```
Input:
  Period Length: 15 days (invalid)

Expected:
  ❌ Error: "Period length must be between 1 and 10 days"
  ❌ Form not submitted
```

---

### 3. CYCLE DETECTION & PREDICTIONS TESTS

#### TC-PRED-001: Cycle Length Analysis
```
Data: 3 cycles logged (27, 27, 28 days)

Expected in Cycle Detection Modal:
  ✅ Average Cycle Length: 27 days
  ✅ Standard Deviation: 0.5 days
  ✅ Regularity: Regular
  ✅ Cycles Analyzed: 3
```

#### TC-PRED-002: Ovulation Prediction
```
Data: Next period predicted for March 15, 2024

Expected:
  ✅ Ovulation Date: March 1, 2024 (14 days before)
  ✅ Shown in Cycle Detection modal
  ✅ Calculation: Next Period - 14 days
```

#### TC-PRED-003: Fertile Window
```
Data: Ovulation on March 1, 2024

Expected:
  ✅ Fertile Start: February 25, 2024 (5 days before)
  ✅ Fertile End: March 2, 2024 (1 day after)
  ✅ Total: 7-day window
  ✅ Green highlight on calendar
```

#### TC-PRED-004: Irregular Cycle Detection
```
Data: Cycles of 25, 35, 28, 32 days

Expected:
  ✅ Standard Deviation: >8 days
  ✅ Status: Irregular
  ✅ Warning message shown
  ✅ Recommendation to track patterns
```

---

### 4. MOOD TRACKING TESTS

#### TC-MOOD-001: Log Mood Entry
```
Input:
  Date: February 5, 2024
  Mood: Anxious
  Symptoms: Headache, Irritability
  Notes: "Feeling stressed"

Expected:
  ✅ Mood saved to localStorage
  ✅ Shows in mood calendar
  ✅ Mood icon displayed on date
  ✅ Available for PMS analysis
```

#### TC-MOOD-002: Edit Mood Entry
```
Action: Edit existing mood
Changes: Mood from Anxious to Calm

Expected:
  ✅ Mood updated in localStorage
  ✅ Calendar updated
  ✅ PMS analysis recalculated
```

#### TC-MOOD-003: Delete Mood Entry
```
Action: Delete mood entry

Expected:
  ✅ Removed from localStorage
  ✅ Calendar updated
  ✅ PMS analysis recalculated
```

#### TC-MOOD-004: Mood Calendar View
```
Action: View mood calendar

Expected:
  ✅ All logged moods displayed
  ✅ Color-coded by mood type
  ✅ Clickable dates show details
  ✅ Current month highlighted
```

---

### 5. PMS PREDICTION TESTS

#### TC-PMS-001: Insufficient Data
```
Data: Only 1 cycle logged

Expected:
  ❌ PMS Prediction: Not available
  ✅ Message: "Need at least 2 cycles and mood data"
  ✅ Encouragement to keep tracking
```

#### TC-PMS-002: Pattern Detection (100% consistency)
```
Data: 
  - 3 cycles logged
  - Anxious mood 3-5 days before each period
  - Appeared in all 3 cycles

Expected:
  ✅ Cycles Analyzed: 3
  ✅ Recurring Mood: Anxious (100%)
  ✅ Pattern detected: Yes
  ✅ Next PMS window calculated
  ✅ Personalized recommendations shown
```

#### TC-PMS-003: Pattern Detection (60% threshold)
```
Data:
  - 3 cycles logged
  - Anxious in 2/3 cycles (67%)
  - Irritable in 2/3 cycles (67%)
  - Happy in 1/3 cycles (33%)

Expected:
  ✅ Recurring: Anxious (67%) ✅
  ✅ Recurring: Irritable (67%) ✅
  ❌ Not Recurring: Happy (33%) ❌
  ✅ Only moods ≥60% shown as patterns
```

#### TC-PMS-004: No Pattern Detected
```
Data:
  - 3 cycles logged
  - Different moods each cycle
  - No consistency

Expected:
  ✅ Cycles Analyzed: 3
  ❌ Recurring Patterns: None
  ✅ Message: "No consistent patterns detected yet"
  ✅ Encouragement to continue tracking
```

#### TC-PMS-005: PMS Window Calculation
```
Data:
  - Next period: March 15, 2024
  - PMS window: 5 days before

Expected:
  ✅ PMS Start: March 10, 2024
  ✅ PMS End: March 14, 2024
  ✅ Days Until PMS: Calculated correctly
  ✅ Shown in Cycle Detection modal
```

#### TC-PMS-006: PMS Notification Trigger
```
Data:
  - Next PMS window: March 10-14
  - Current date: March 8 (2 days before)

Expected:
  ✅ Notification permission requested
  ✅ Notification shown: "PMS Alert: You typically feel anxious around this time"
  ✅ Personalized message based on patterns
  ✅ Notification includes days until PMS
```

#### TC-PMS-007: Recurring Symptoms
```
Data:
  - Headache in 3/3 cycles (100%)
  - Bloating in 2/3 cycles (67%)
  - Cramps in 1/3 cycles (33%)

Expected:
  ✅ Recurring: Headache (100%)
  ✅ Recurring: Bloating (67%)
  ❌ Not Recurring: Cramps (33%)
  ✅ Recommendations based on symptoms
```

#### TC-PMS-008: Personalized Recommendations
```
Data:
  - Recurring mood: Anxious
  - Recurring symptom: Headache

Expected Recommendations:
  ✅ "Practice Relaxation" (for anxiety)
  ✅ "Try meditation, deep breathing, or yoga"
  ✅ "Prepare for Cramps" (if applicable)
  ✅ "Stay Hydrated"
  ✅ "Balanced Diet"
```

---

### 6. ANALYTICS TESTS

#### TC-ANALYTICS-001: Cycle Trend Chart
```
Data: 6 months of cycles

Expected:
  ✅ Line chart showing cycle lengths over time
  ✅ X-axis: Months
  ✅ Y-axis: Cycle length (days)
  ✅ Trend line visible
  ✅ Data points clickable
```

#### TC-ANALYTICS-002: Flow Intensity Distribution
```
Data: 
  - Light: 2 cycles
  - Medium: 5 cycles
  - Heavy: 3 cycles

Expected:
  ✅ Pie chart showing distribution
  ✅ Light: 20%
  ✅ Medium: 50%
  ✅ Heavy: 30%
  ✅ Color-coded segments
```

#### TC-ANALYTICS-003: Mood Distribution
```
Data: Various mood entries

Expected:
  ✅ Bar chart showing mood frequency
  ✅ Most common moods highlighted
  ✅ Percentage for each mood
  ✅ Color-coded bars
```

#### TC-ANALYTICS-004: Irregularity Visualization
```
Data: Cycles with varying lengths

Expected:
  ✅ Chart showing cycle length variation
  ✅ Standard deviation displayed
  ✅ Irregular cycles highlighted
  ✅ Threshold line at 8 days
```

#### TC-ANALYTICS-005: Health Summary Card
```
Data: 6 months of tracking

Expected:
  ✅ Total cycles tracked
  ✅ Average cycle length
  ✅ Average period length
  ✅ Regularity status
  ✅ Most common symptoms
```

---

### 7. INSIGHTS TESTS

#### TC-INSIGHT-001: Cycle Insights
```
Data: Regular 27-day cycles

Expected:
  ✅ "Your cycles are consistent"
  ✅ Average cycle length shown
  ✅ Regularity status
  ✅ Positive feedback
```

#### TC-INSIGHT-002: Mood Insights
```
Data: Mood patterns detected

Expected:
  ✅ Most common moods listed
  ✅ Mood trends over time
  ✅ Correlation with cycle phase
  ✅ Recommendations
```

#### TC-INSIGHT-003: Correlation Insights
```
Data: Heavy flow + cramps pattern

Expected:
  ✅ "Heavy flow often occurs with cramps"
  ✅ Symptom correlations shown
  ✅ Percentage of co-occurrence
  ✅ Management tips
```

#### TC-INSIGHT-004: Wellness Recommendations
```
Data: User's tracking history

Expected:
  ✅ Personalized tips based on data
  ✅ Diet recommendations
  ✅ Exercise suggestions
  ✅ Stress management tips
  ✅ Sleep hygiene advice
```

---

### 8. PDF REPORT TESTS

#### TC-REPORT-001: Generate PDF Report
```
Action: Click "Download Report" on dashboard

Expected:
  ✅ PDF generated successfully
  ✅ File downloaded: Lunara_Health_Report_YYYY-MM-DD.pdf
  ✅ Contains user information
  ✅ 6-month cycle summary included
  ✅ Charts and graphs rendered
```

#### TC-REPORT-002: PDF Content Verification
```
Expected Content:
  ✅ User name and date
  ✅ Average cycle length
  ✅ Irregularity score
  ✅ Mood trend summary
  ✅ Top symptoms
  ✅ Recommendations
  ✅ Wellness theme styling
```

#### TC-REPORT-003: Preview PDF
```
Action: Click "Preview Report"

Expected:
  ✅ PDF opens in new tab
  ✅ Inline display (not download)
  ✅ Same content as download
  ✅ Properly formatted
```

#### TC-REPORT-004: Report with Insufficient Data
```
Data: Only 1 cycle logged

Expected:
  ✅ Report still generates
  ✅ Shows available data
  ✅ Message: "Track more cycles for better insights"
  ✅ Encouragement to continue
```

---

### 9. NOTIFICATION TESTS

#### TC-NOTIF-001: Permission Request
```
Action: First visit to Cycle Tracking page

Expected:
  ✅ Browser notification permission requested
  ✅ User can allow/deny
  ✅ Choice saved for future
```

#### TC-NOTIF-002: Period Reminder (3 days before)
```
Data: Next period in 3 days

Expected:
  ✅ Notification shown
  ✅ Title: "Period Reminder"
  ✅ Body: "Your period is expected in 3 days"
  ✅ Icon displayed
```

#### TC-NOTIF-003: Period Reminder (1 day before)
```
Data: Next period tomorrow

Expected:
  ✅ Notification shown
  ✅ Body: "Your period is expected in 1 day"
  ✅ Urgent styling
```

#### TC-NOTIF-004: PMS Alert
```
Data: 
  - PMS window starts in 2 days
  - Recurring mood: Anxious

Expected:
  ✅ Notification shown
  ✅ Title: "PMS Alert 🎯"
  ✅ Body: "You typically feel anxious around this time. Your PMS window starts in 2 days."
  ✅ Personalized message
```

#### TC-NOTIF-005: No Notification (Permission Denied)
```
Data: User denied notification permission

Expected:
  ❌ No notifications shown
  ✅ App still functions normally
  ✅ Predictions still visible in app
```

---

### 10. DATA ISOLATION & SECURITY TESTS

#### TC-SEC-001: User Data Isolation
```
Setup:
  - User A: testuser1@lunara.com
  - User B: testuser2@lunara.com
  - Both log cycles

Test:
  1. Login as User A
  2. View cycles

Expected:
  ✅ Only User A's cycles visible
  ❌ User B's cycles NOT visible
  ✅ API filters by user ID
  ✅ MongoDB query includes user filter
```

#### TC-SEC-002: Unauthorized Access
```
Action: Try to access /dashboard without login

Expected:
  ❌ Redirected to login page
  ❌ Protected route blocked
  ✅ Token verification required
```

#### TC-SEC-003: Token Expiration
```
Action: Use expired JWT token

Expected:
  ❌ 401 Unauthorized error
  ❌ Redirected to login
  ✅ Token removed from localStorage
  ✅ User must login again
```

#### TC-SEC-004: Password Security
```
Test: Check database

Expected:
  ✅ Password hashed with bcrypt
  ❌ Plain text password NOT stored
  ✅ Salt rounds: 10
  ✅ Hash length: 60 characters
```

#### TC-SEC-005: API Rate Limiting
```
Action: Make 100 requests in 1 minute

Expected:
  ✅ First 100 requests succeed
  ❌ Request 101+: 429 Too Many Requests
  ✅ Rate limit message shown
  ✅ Retry after cooldown period
```

---

### 11. EDGE CASES & ERROR HANDLING

#### TC-EDGE-001: No Internet Connection
```
Action: Disconnect internet, try to log cycle

Expected:
  ❌ Error: "Network Error"
  ✅ User-friendly message shown
  ✅ Data not lost (can retry)
```

#### TC-EDGE-002: Server Down
```
Action: Backend server stopped

Expected:
  ❌ Error: "Unable to connect to server"
  ✅ Graceful error handling
  ✅ No app crash
```

#### TC-EDGE-003: Invalid Date Format
```
Input: Manually enter "2024-13-45" (invalid)

Expected:
  ❌ Browser validation error
  ❌ Form not submitted
  ✅ Error message shown
```

#### TC-EDGE-004: Very Long Cycle (>45 days)
```
Input: Cycle length of 60 days

Expected:
  ❌ Validation error
  ❌ Message: "Cycle length must be between 20 and 45 days"
  ✅ Recommendation to consult doctor
```

#### TC-EDGE-005: Future Date Entry
```
Input: Start date in future (e.g., next month)

Expected:
  ✅ Accepted (for planning)
  ✅ Marked as predicted/planned
  ✅ Different styling on calendar
```

#### TC-EDGE-006: Duplicate Cycle Entry
```
Action: Try to log cycle on same date twice

Expected:
  ❌ Warning: "Cycle already exists for this date"
  ✅ Option to edit existing cycle
  ❌ Duplicate not created
```

---

### 12. PERFORMANCE TESTS

#### TC-PERF-001: Large Dataset
```
Data: 100+ cycles logged

Expected:
  ✅ Page loads in <2 seconds
  ✅ Pagination works correctly
  ✅ Charts render smoothly
  ✅ No lag in interactions
```

#### TC-PERF-002: Calendar Rendering
```
Action: Navigate through 12 months

Expected:
  ✅ Each month loads instantly
  ✅ No flickering
  ✅ Smooth transitions
  ✅ Data loads progressively
```

#### TC-PERF-003: Analytics Calculation
```
Data: 6 months of data

Expected:
  ✅ Analytics calculated in <1 second
  ✅ Charts render smoothly
  ✅ No UI freeze
  ✅ Progress indicator if needed
```

---

### 13. MOBILE RESPONSIVENESS TESTS

#### TC-MOBILE-001: Mobile Layout
```
Device: iPhone 12 (390x844)

Expected:
  ✅ All elements visible
  ✅ No horizontal scroll
  ✅ Touch-friendly buttons
  ✅ Readable text size
```

#### TC-MOBILE-002: Calendar on Mobile
```
Device: Mobile phone

Expected:
  ✅ Calendar fits screen
  ✅ Dates are tappable
  ✅ Swipe to change months
  ✅ Modal opens correctly
```

#### TC-MOBILE-003: Forms on Mobile
```
Device: Mobile phone

Expected:
  ✅ Input fields accessible
  ✅ Date picker works
  ✅ Dropdowns functional
  ✅ Submit button visible
```

---

## 📊 Test Execution Summary Template

```
Test Date: __________
Tester: __________
Environment: Development / Production

Total Test Cases: 100+
Passed: ___
Failed: ___
Blocked: ___
Not Executed: ___

Pass Rate: ___%

Critical Issues Found:
1. 
2. 
3. 

Recommendations:
1. 
2. 
3. 
```

---

## ✅ Acceptance Criteria

### Must Pass (Critical):
- [ ] All authentication tests pass
- [ ] Cycle tracking and prediction accurate
- [ ] Date display correct (no timezone issues)
- [ ] PMS prediction working with 60% threshold
- [ ] Data isolation between users
- [ ] No security vulnerabilities

### Should Pass (Important):
- [ ] All analytics display correctly
- [ ] PDF reports generate successfully
- [ ] Notifications work properly
- [ ] Mobile responsive
- [ ] Performance acceptable

### Nice to Have:
- [ ] All edge cases handled
- [ ] Error messages user-friendly
- [ ] Loading states smooth
- [ ] Animations polished

---

Good luck testing! 🚀
