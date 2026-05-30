/**
 * 学習ヒートマップカレンダー
 * GitHubスタイルの草グラフで年間学習実績を可視化
 */
class StudyHeatmap {
    constructor(containerId) {
        this.containerId = containerId;
        this.cellSize = 12;
        this.gap = 2;
        this.weeks = 53;
    }

    /**
     * ヒートマップを描画する
     * @param {Array} studyRecords - 学習記録配列 [{date: 'YYYY-MM-DD', hours: number}]
     */
    render(studyRecords) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const dailyMap = this._buildDailyMap(studyRecords);
        const { totalDays, maxHours } = this._calcStats(dailyMap);

        container.innerHTML = this._buildHTML(dailyMap, totalDays, maxHours);
        this._attachTooltips(container);
    }

    /** 日付→時間のMapを構築 */
    _buildDailyMap(records) {
        const map = new Map();
        (records || []).forEach(r => {
            if (!r.date) return;
            const existing = map.get(r.date) || 0;
            map.set(r.date, existing + (r.hours || 0));
        });
        return map;
    }

    _calcStats(dailyMap) {
        let totalDays = 0;
        let maxHours = 0;
        dailyMap.forEach((hours, _) => {
            if (hours > 0) totalDays++;
            if (hours > maxHours) maxHours = hours;
        });
        return { totalDays, maxHours };
    }

    /** 時間に応じたCSSクラス（4段階） */
    _levelClass(hours) {
        if (!hours || hours <= 0) return 'heatmap-cell-0';
        if (hours < 1) return 'heatmap-cell-1';
        if (hours < 2) return 'heatmap-cell-2';
        if (hours < 3) return 'heatmap-cell-3';
        return 'heatmap-cell-4';
    }

    _buildHTML(dailyMap, totalDays, maxHours) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 過去365日分のセルを生成（今日含む）
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364);
        // 週の日曜始まりに揃える
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        // 月ラベル計算用
        const monthLabels = [];
        let prevMonth = -1;
        let weekIndex = 0;

        // 全セルを週単位でグループ化
        const weeks = [];
        let currentDate = new Date(startDate);
        while (currentDate <= today) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const dateStr = this._formatDate(currentDate);
                const isFuture = currentDate > today;
                const hours = isFuture ? null : (dailyMap.get(dateStr) || 0);
                const month = currentDate.getMonth();

                if (!isFuture && d === 0 && month !== prevMonth) {
                    monthLabels.push({ weekIndex, month });
                    prevMonth = month;
                }

                week.push({
                    date: dateStr,
                    hours,
                    isFuture,
                    displayDate: new Date(currentDate)
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(week);
            weekIndex++;
        }

        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
                           '7月', '8月', '9月', '10月', '11月', '12月'];
        const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

        // 月ラベルHTML
        const monthLabelHTML = monthLabels.map(m =>
            `<span style="position:absolute;left:${m.weekIndex * (this.cellSize + this.gap)}px;font-size:10px;color:#6b7280;">${monthNames[m.month]}</span>`
        ).join('');

        // グリッドHTML
        const gridHTML = weeks.map(week =>
            `<div class="heatmap-week" style="display:flex;flex-direction:column;gap:${this.gap}px;">` +
            week.map(cell => {
                if (cell.isFuture) {
                    return `<div class="heatmap-cell" style="width:${this.cellSize}px;height:${this.cellSize}px;border-radius:2px;background:#f3f4f6;"></div>`;
                }
                const lvl = this._levelClass(cell.hours);
                const label = cell.hours > 0
                    ? `${cell.date}: ${cell.hours.toFixed(1)}時間`
                    : `${cell.date}: 学習なし`;
                return `<div class="heatmap-cell ${lvl}" data-tip="${label}" style="width:${this.cellSize}px;height:${this.cellSize}px;border-radius:2px;cursor:pointer;" title="${label}"></div>`;
            }).join('') +
            '</div>'
        ).join('');

        const gridWidth = weeks.length * (this.cellSize + this.gap);

        return `
            <div class="heatmap-wrapper" style="overflow-x:auto;padding-bottom:4px;">
                <div style="display:flex;gap:6px;">
                    <!-- 曜日ラベル -->
                    <div style="display:flex;flex-direction:column;gap:${this.gap}px;padding-top:16px;">
                        ${dayLabels.map((d, i) => {
                            const show = i === 1 || i === 3 || i === 5; // 月水金のみ表示
                            return `<div style="width:16px;height:${this.cellSize}px;font-size:9px;color:#9ca3af;line-height:${this.cellSize}px;text-align:right;">${show ? d : ''}</div>`;
                        }).join('')}
                    </div>
                    <!-- メイングリッド -->
                    <div>
                        <!-- 月ラベル -->
                        <div style="position:relative;height:16px;margin-bottom:2px;">
                            ${monthLabelHTML}
                        </div>
                        <!-- セルグリッド -->
                        <div style="display:flex;gap:${this.gap}px;">
                            ${gridHTML}
                        </div>
                    </div>
                </div>
                <!-- 凡例 -->
                <div style="display:flex;align-items:center;gap:4px;margin-top:8px;justify-content:flex-end;">
                    <span style="font-size:10px;color:#6b7280;">少ない</span>
                    <div class="heatmap-cell-0" style="width:11px;height:11px;border-radius:2px;"></div>
                    <div class="heatmap-cell-1" style="width:11px;height:11px;border-radius:2px;"></div>
                    <div class="heatmap-cell-2" style="width:11px;height:11px;border-radius:2px;"></div>
                    <div class="heatmap-cell-3" style="width:11px;height:11px;border-radius:2px;"></div>
                    <div class="heatmap-cell-4" style="width:11px;height:11px;border-radius:2px;"></div>
                    <span style="font-size:10px;color:#6b7280;">多い</span>
                </div>
            </div>
        `;
    }

    _formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    _attachTooltips(container) {
        // モバイル対応：タッチで tooltip を簡易表示
        container.querySelectorAll('.heatmap-cell[data-tip]').forEach(cell => {
            cell.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const tip = document.getElementById('heatmap-tooltip');
                if (tip) {
                    tip.textContent = this.dataset.tip;
                    tip.style.display = 'block';
                    setTimeout(() => { tip.style.display = 'none'; }, 2000);
                }
            }, { passive: false });
        });
    }
}

/**
 * 今日のおすすめ学習プランを生成
 * 試験日・進捗・学習記録から優先科目を提案
 */
function generateTodayPlan(studyData) {
    const container = document.getElementById('todayPlanSection');
    if (!container) return;

    if (!studyData || !studyData.examDate) {
        container.innerHTML = `
            <div class="text-center py-6 text-gray-500">
                <p class="text-sm">試験日を設定すると今日の推奨学習が表示されます</p>
                <a href="#examDate" onclick="document.getElementById('examDate').focus();" class="text-blue-600 text-sm hover:underline mt-1 inline-block">試験日を設定する →</a>
            </div>`;
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayHours = (studyData.studyRecords || [])
        .filter(r => r.date === today)
        .reduce((sum, r) => sum + (r.hours || 0), 0);
    const goalHours = studyData.dailyHours || 2;
    const goalRate = Math.min(100, Math.round((todayHours / goalHours) * 100));

    // 残り日数
    const examDate = new Date(studyData.examDate);
    const diffDays = Math.max(0, Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24)));

    // 科目別優先度計算（遅れている科目＝100 - progress が高い）
    const subjects = [
        { key: 'economics', name: '経済学', color: 'red' },
        { key: 'finance', name: '財務・会計', color: 'orange' },
        { key: 'management', name: '企業経営理論', color: 'yellow' },
        { key: 'operations', name: '運営管理', color: 'green' },
        { key: 'legal', name: '経営法務', color: 'cyan' },
        { key: 'it', name: '情報システム', color: 'blue' },
        { key: 'policy', name: '中小企業政策', color: 'purple' }
    ];

    const priorities = subjects.map(s => {
        const subj = studyData.subjects[s.key] || {};
        const gap = 100 - (subj.progress || 0);
        const lastStudied = subj.lastStudied;
        const daysSince = lastStudied
            ? Math.floor((new Date() - new Date(lastStudied)) / (1000 * 60 * 60 * 24))
            : 999;
        // 進捗遅れ×0.7 + 未学習日数×0.3
        const score = gap * 0.7 + Math.min(daysSince, 30) * 0.3;
        return { ...s, progress: subj.progress || 0, score, daysSince };
    }).sort((a, b) => b.score - a.score);

    const top3 = priorities.slice(0, 3);
    const hoursPerSubj = goalHours > 0 ? (goalHours / top3.length).toFixed(1) : 0.5;

    // 今日の達成状況
    const isGoalDone = todayHours >= goalHours;
    const goalBarColor = isGoalDone ? 'bg-green-500' : 'bg-blue-500';

    container.innerHTML = `
        <!-- 今日の進捗バー -->
        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-700">今日の学習目標</span>
                <span class="text-sm font-semibold ${isGoalDone ? 'text-green-600' : 'text-gray-600'}">${todayHours.toFixed(1)}h / ${goalHours}h (${goalRate}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="${goalBarColor} h-2 rounded-full transition-all duration-500" style="width:${goalRate}%;"></div>
            </div>
            ${isGoalDone ? '<p class="text-xs text-green-600 mt-1">🎉 今日の目標達成！</p>' : ''}
        </div>
        <!-- 推奨科目 -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${top3.map((s, i) => `
                <div class="bg-${s.color}-50 border border-${s.color}-200 rounded-lg p-3">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-bold text-${s.color}-700">${i === 0 ? '🥇 優先1位' : i === 1 ? '🥈 優先2位' : '🥉 優先3位'}</span>
                        <span class="text-xs text-${s.color}-600">${s.progress}%完了</span>
                    </div>
                    <div class="font-semibold text-gray-800 text-sm">${s.name}</div>
                    <div class="text-xs text-gray-500 mt-1">目安: ${hoursPerSubj}時間</div>
                    ${s.daysSince < 999 ? `<div class="text-xs text-gray-400">${s.daysSince === 0 ? '今日学習済み' : s.daysSince + '日前に学習'}</div>` : '<div class="text-xs text-gray-400">まだ未学習</div>'}
                </div>
            `).join('')}
        </div>
        ${diffDays > 0 ? `<div class="mt-3 text-xs text-gray-500 text-right">試験まで残り <span class="font-bold text-gray-700">${diffDays}日</span> | 1日必要: <span class="font-bold text-gray-700">${goalHours}時間</span></div>` : ''}
    `;
}

/**
 * 弱点分析レポートを生成
 * quizHistoryから科目別正答率と間違い問題を集計
 */
function generateWeakPointsReport() {
    const container = document.getElementById('weakPointsTab');
    if (!container) return;

    // quiz.jsは 'quizHistory' キーで保存している
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');

    if (!quizHistory || quizHistory.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-400">
                <div class="text-5xl mb-4">📊</div>
                <p class="text-lg font-medium text-gray-500">まだデータがありません</p>
                <p class="text-sm mt-2">過去問を解くと弱点分析が表示されます</p>
                <a href="quiz.html" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">過去問を解く →</a>
            </div>`;
        return;
    }

    // 全問題の解答履歴を集計
    // quizRecord.results.subjectStats: {subjectKey: {name, total, correct}}
    // quizRecord.results.wrongAnswers: [{question: {id, subject, question}, userAnswer, correctAnswer}]
    const subjectStats = {};
    const wrongQuestions = {};

    quizHistory.forEach(session => {
        if (!session.results) return;

        // 科目別統計の集約
        const ss = session.results.subjectStats || {};
        Object.entries(ss).forEach(([key, val]) => {
            if (!subjectStats[key]) {
                subjectStats[key] = { correct: 0, total: 0, name: val.name || _getSubjectName(key) };
            }
            subjectStats[key].total += val.total || 0;
            subjectStats[key].correct += val.correct || 0;
        });

        // 間違い問題の集約
        const wa = session.results.wrongAnswers || [];
        wa.forEach(item => {
            if (!item.question) return;
            const qId = item.question.id;
            const subjectKey = item.question.subject || _getSubjectFromId(qId);
            if (!wrongQuestions[qId]) {
                wrongQuestions[qId] = {
                    count: 0,
                    question: item.question.question || qId,
                    subject: subjectKey
                };
            }
            wrongQuestions[qId].count++;
        });
    });

    // 総演習問題数
    const totalSessions = quizHistory.length;
    const totalQuestions = Object.values(subjectStats).reduce((s, v) => s + v.total, 0);
    const totalCorrect = Object.values(subjectStats).reduce((s, v) => s + v.correct, 0);
    const overallRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // 科目別正答率（低い順にソート）
    const sortedSubjects = Object.entries(subjectStats)
        .map(([key, v]) => ({
            key,
            name: v.name,
            rate: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
            total: v.total,
            correct: v.correct
        }))
        .sort((a, b) => a.rate - b.rate);

    // 間違い多い問題TOP5
    const top5Wrong = Object.entries(wrongQuestions)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);

    const barColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500'];

    container.innerHTML = `
        <!-- サマリー -->
        <div class="grid grid-cols-3 gap-3 mb-6">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-700">${totalSessions}</div>
                <div class="text-xs text-blue-600 mt-1">演習回数</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-700">${totalQuestions}</div>
                <div class="text-xs text-green-600 mt-1">解答問題数</div>
            </div>
            <div class="text-center p-3 ${overallRate >= 60 ? 'bg-purple-50' : 'bg-red-50'} rounded-lg">
                <div class="text-2xl font-bold ${overallRate >= 60 ? 'text-purple-700' : 'text-red-700'}">${overallRate}%</div>
                <div class="text-xs ${overallRate >= 60 ? 'text-purple-600' : 'text-red-600'} mt-1">総合正答率</div>
            </div>
        </div>

        <!-- 科目別正答率 -->
        <div class="mb-6">
            <h4 class="font-semibold text-gray-800 mb-3">科目別正答率（弱い順）</h4>
            <div class="space-y-3">
                ${sortedSubjects.map((s, i) => `
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-sm font-medium text-gray-700">${s.name}</span>
                            <span class="text-sm font-semibold ${s.rate < 50 ? 'text-red-600' : s.rate < 70 ? 'text-yellow-600' : 'text-green-600'}">${s.rate}% (${s.correct}/${s.total}問)</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-3">
                            <div class="${barColors[i % barColors.length]} h-3 rounded-full transition-all" style="width:${s.rate}%;"></div>
                        </div>
                        ${s.rate < 50 ? '<span class="text-xs text-red-500">要重点学習</span>' : s.rate < 70 ? '<span class="text-xs text-yellow-500">要復習</span>' : '<span class="text-xs text-green-500">良好</span>'}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 間違い多い問題 -->
        ${top5Wrong.length > 0 ? `
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">よく間違える問題 TOP5</h4>
            <div class="space-y-2">
                ${top5Wrong.map(([qId, info], i) => `
                    <div class="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <span class="text-red-600 font-bold text-sm min-w-4">${i + 1}</span>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs text-red-500 font-medium">${_getSubjectName(info.subject)} | ${info.count}回間違い</div>
                            <div class="text-sm text-gray-700 truncate">${info.question}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>` : ''}
    `;
}

function _getSubjectFromId(id) {
    if (!id) return null;
    if (id.startsWith('eco_')) return 'economics';
    if (id.startsWith('fin_')) return 'finance';
    if (id.startsWith('mgmt_')) return 'management';
    if (id.startsWith('ops_')) return 'operations';
    if (id.startsWith('leg_')) return 'legal';
    if (id.startsWith('it_')) return 'it';
    if (id.startsWith('pol_')) return 'policy';
    return null;
}

function _getSubjectName(key) {
    const map = {
        economics: '経済学・経済政策',
        finance: '財務・会計',
        management: '企業経営理論',
        operations: '運営管理',
        legal: '経営法務',
        it: '経営情報システム',
        policy: '中小企業経営・政策'
    };
    return map[key] || key;
}

// グローバル公開
window.StudyHeatmap = StudyHeatmap;
window.generateTodayPlan = generateTodayPlan;
window.generateWeakPointsReport = generateWeakPointsReport;
