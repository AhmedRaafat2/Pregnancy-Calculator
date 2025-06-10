// Initialize the Pregnancy Tool when DOM is fully loaded
// تهيئة أداة متابعة الحمل بعد تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
            // Tab switching functionality
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all tabs
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    btn.classList.add('active');
                    const tabId = btn.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            // Constants
            // Define total pregnancy duration in weeks
// تعريف مدة الحمل الإجمالية بالأسابيع
const PREGNANCY_WEEKS = 40;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Set today as default for date inputs
            //document.getElementById('date').value = today.toISOString().split('T')[0]; // Set today's date in date picker
// تعيين تاريخ اليوم في حقل اختيار التاريخ
            //document.getElementById('target-date').value = today.toISOString().split('T')[0]; // Set today's date in target date picker
// تعيين تاريخ اليوم في حقل التاريخ المطلوب
            
            // Initialize direct calculation
            // Initialize Direct Calculation functionality
// تهيئة وظيفة الحساب المباشر
initDirectCalculation();
            
            // Initialize reverse calculation
            // Initialize Reverse Calculation functionality
// تهيئة وظيفة الحساب العكسي
initReverseCalculation();
            
            // Initialize calendar functionality
            // Initialize Calendar display functionality
// تهيئة عرض التقويم
initCalendar();
            
            // Function to initialize direct pregnancy calculation logic
// دالة تهيئة منطق الحساب المباشر للحمل
function initDirectCalculation() {
                // Direct calculation functionality
                const calculateBtn = document.getElementById('calculate-btn');
                const dateInput = document.getElementById('date');
                const pregnancyStartDateElement = document.getElementById('pregnancy-start-date');
                const dueDateElement = document.getElementById('due-date');
                const currentWeekElement = document.getElementById('current-week');
                const displayCurrentWeekElement = document.getElementById('display-current-week');
                const pregnancyProgress = document.getElementById('pregnancy-progress');
                const calendarElement = document.getElementById('pregnancy-calendar');
                const methodRadios = document.querySelectorAll('input[name="method"]');
                const dateLabel = document.querySelector('label[for="date"]');
                
                // Modal elements
                const errorModal = document.getElementById('error-modal');
                const modalTitle = document.getElementById('modal-title');
                const modalMessage = document.getElementById('modal-message');
                const modalCloseBtn = document.getElementById('modal-close');
                
                // Update date input label based on selected method
                methodRadios.forEach(radio => {
                    radio.addEventListener('change', function() {
                        if (this.value === 'edd') {
                            dateLabel.textContent = "تاريخ الولادة المتوقع:";
                            dateInput.removeAttribute('max');
                        } else if (this.value === 'ivf'){
                            dateLabel.textContent = "تاريخ الحقن المجهرى:";
                            dateInput.max = today.toISOString().split("T")[0];
                        } else {
                            dateLabel.textContent = "تاريخ البداية:";
                            dateInput.max = today.toISOString().split("T")[0];
                        }
                    });
                });

                // Event Listeners
                calculateBtn.addEventListener('click', calculatePregnancy);
                modalCloseBtn.addEventListener('click', () => errorModal.classList.remove('show'));
                errorModal.addEventListener('click', (e) => {
                    if (e.target === errorModal) {
                        errorModal.classList.remove('show');
                    }
                });

                // Function to show the custom modal
                function showModal(title, message) {
                    modalTitle.textContent = title;
                    modalMessage.textContent = message;
                    errorModal.classList.add('show');
                }
                
                function calculatePregnancy() {
                    const method = document.querySelector('input[name="method"]:checked').value;
                    const selectedDate = new Date(dateInput.value);
                    
                    if (isNaN(selectedDate.getTime())) {
                        showModal('خطأ في الإدخال', 'الرجاء اختيار تاريخ صحيح من التقويم.');
                        return;
                    }
                    selectedDate.setHours(0, 0, 0, 0);
                    
                    // Validation Checks
                    if ((method === 'lmp' || method === 'ivf') && selectedDate > today) {
                        showModal('تاريخ غير صحيح', 'لا يمكن اختيار تاريخ في المستقبل. الرجاء اختيار تاريخ اليوم أو تاريخ سابق.');
                        return;
                    }
                    
                    let pregnancyStartDate, dueDate;
                    
                    if (method === 'lmp') {
                        pregnancyStartDate = new Date(selectedDate);
                        dueDate = new Date(pregnancyStartDate);
                        dueDate.setDate(dueDate.getDate() + PREGNANCY_WEEKS * 7);
                    } 
                    else if (method === 'ivf') {
                        pregnancyStartDate = new Date(selectedDate);
                        pregnancyStartDate.setDate(pregnancyStartDate.getDate() - 14);
                        dueDate = new Date(pregnancyStartDate);
                        dueDate.setDate(dueDate.getDate() + PREGNANCY_WEEKS * 7);
                    } 
                    else { // EDD method
                        dueDate = new Date(selectedDate);
                        pregnancyStartDate = new Date(dueDate);
                        pregnancyStartDate.setDate(pregnancyStartDate.getDate() - PREGNANCY_WEEKS * 7);
                    }
                    
                    // Check if pregnancy has ended
                    if (dueDate < today) {
                        const timeDiff = today - dueDate;
                        const daysSinceEnded = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                        
                        let dayString;
                        if (daysSinceEnded <= 0) {
                            dayString = "اليوم";
                        } else if (daysSinceEnded === 1) {
                            dayString = "يوم واحد";
                        } else if (daysSinceEnded === 2) {
                            dayString = "يومين";
                        } else if (daysSinceEnded >= 3 && daysSinceEnded <= 10) {
                            dayString = `${daysSinceEnded} أيام`;
                        } else {
                            dayString = `${daysSinceEnded} يومًا`;
                        }

                        const message = `بناءً على التاريخ المحدد، يبدو أن الحمل قد انتهى بالفعل منذ ${dayString}. الرجاء التأكد من التاريخ.`;
                        showModal('تاريخ غير منطقي', message);
                        return;
                    }
                    
                    // Calculate current week
                    const diffTime = today - pregnancyStartDate;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                    const currentWeek = Math.min(Math.floor(diffDays / 7) + 1, PREGNANCY_WEEKS);
                    
                    // Update UI
                    pregnancyStartDateElement.textContent = formatDate(pregnancyStartDate);
                    dueDateElement.textContent = formatDate(dueDate);
                    currentWeekElement.textContent = `الأسبوع ${currentWeek > 0 ? currentWeek : 'قبل الحمل'}`;
                    displayCurrentWeekElement.textContent = currentWeek > 0 ? currentWeek : '-';
                    
                    const progressPercent = Math.min((diffDays / (PREGNANCY_WEEKS * 7)) * 100, 100);
                    pregnancyProgress.style.width = `${progressPercent > 0 ? progressPercent : 0}%`;
                    
                    generatePregnancyCalendar(pregnancyStartDate, dueDate, currentWeek, calendarElement);
                }
            }
            
            // Function to initialize reverse pregnancy calculation logic
// دالة تهيئة منطق الحساب العكسي للحمل
function initReverseCalculation() {
                // Reverse calculation elements
                const reverseCalculateBtn = document.getElementById('reverse-calculate-btn');
                const targetDateInput = document.getElementById('target-date');
                const pregnancyMonthSelect = document.getElementById('pregnancy-month');
                const pregnancyWeekInput = document.getElementById('pregnancy-week');
                const weekDaySelect = document.getElementById('week-day');
                
                const reversePregnancyStartDateElement = document.getElementById('reverse-pregnancy-start-date');
                const reverseDueDateElement = document.getElementById('reverse-due-date');
                const reverseTargetDateElement = document.getElementById('reverse-target-date');
                const reverseInfoElement = document.getElementById('reverse-info');
                const reverseMonthInfoElement = document.getElementById('reverse-month-info');
                const reverseProgress = document.getElementById('reverse-pregnancy-progress');
                const reverseCalendarElement = document.getElementById('reverse-pregnancy-calendar');
                
                // Month to week range mapping
                const monthToWeekRange = {
                    1: { min: 1, max: 4 },
                    2: { min: 5, max: 8 },
                    3: { min: 9, max: 13 },
                    4: { min: 14, max: 17 },
                    5: { min: 18, max: 21 },
                    6: { min: 22, max: 26 },
                    7: { min: 27, max: 30 },
                    8: { min: 31, max: 35 },
                    9: { min: 36, max: 40 }
                };
                
                // Update week constraints when month changes
                pregnancyMonthSelect.addEventListener('change', function() {
                    const month = parseInt(this.value);
                    const weekRange = monthToWeekRange[month];
                    
                    pregnancyWeekInput.min = weekRange.min;
                    pregnancyWeekInput.max = weekRange.max;
                    
                    // Adjust week value if out of range
                    if (parseInt(pregnancyWeekInput.value) < weekRange.min) {
                        pregnancyWeekInput.value = weekRange.min;
                    } else if (parseInt(pregnancyWeekInput.value) > weekRange.max) {
                        pregnancyWeekInput.value = weekRange.min;
                    }
                });
                
                // Event listener for reverse calculation button
                reverseCalculateBtn.addEventListener('click', calculateReversePregnancy);
                
                function calculateReversePregnancy() {
                    const targetDate = new Date(targetDateInput.value);

                    if (isNaN(targetDate.getTime())) {
                        showReverseError('خطأ في الإدخال', 'الرجاء اختيار تاريخ صحيح من التقويم.');
                        return;
                    }
                    targetDate.setHours(0, 0, 0, 0);
                    
                    const pregnancyMonth = parseInt(pregnancyMonthSelect.value);
                    const pregnancyWeek = parseInt(pregnancyWeekInput.value);
                    const weekDay = parseInt(weekDaySelect.value);
                    
                    // Validate week against month
                    const weekRange = monthToWeekRange[pregnancyMonth];
                    if (pregnancyWeek < weekRange.min || pregnancyWeek > weekRange.max) {
                        showReverseError('خطأ في الإدخال', `الأسبوع ${pregnancyWeek} ليس ضمن الشهر ${pregnancyMonth} (يجب أن يكون بين ${weekRange.min} و ${weekRange.max})`);
                        return;
                    }
                    
                    // Validate inputs
                    if (pregnancyWeek < 1 || pregnancyWeek > 40) {
                        showReverseError('خطأ في الإدخال', 'الأسبوع يجب أن يكون بين 1 و 40');
                        return;
                    }
                    
                    if (weekDay < 1 || weekDay > 7) {
                        showReverseError('خطأ في الإدخال', 'يوم الأسبوع يجب أن يكون بين 1 و 7');
                        return;
                    }
                    
                    // Calculate the start date
                    // Total days = (pregnancyWeek - 1) * 7 + (weekDay - 1)
                    const daysFromStart = (pregnancyWeek - 1) * 7 + (weekDay - 1);
                    const pregnancyStartDate = new Date(targetDate);
                    pregnancyStartDate.setDate(pregnancyStartDate.getDate() - daysFromStart);
                    
                    // Calculate due date (40 weeks from start date)
                    const dueDate = new Date(pregnancyStartDate);
                    dueDate.setDate(dueDate.getDate() + PREGNANCY_WEEKS * 7);
                    
                    // Update UI
                    reversePregnancyStartDateElement.textContent = formatDate(pregnancyStartDate);
                    reverseDueDateElement.textContent = formatDate(dueDate);
                    reverseTargetDateElement.textContent = formatDate(targetDate);
                    
                    const weekDays = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
                    reverseInfoElement.textContent = `ستكونين في الأسبوع ${pregnancyWeek} من الحمل، يوم ${weekDay} من الأسبوع`;
                    reverseMonthInfoElement.textContent = `في الشهر ${pregnancyMonth} من الحمل`;
                    
                    const progressPercent = (daysFromStart / (PREGNANCY_WEEKS * 7)) * 100;
                    reverseProgress.style.width = `${progressPercent}%`;
                    
                    // Generate calendar
                    generatePregnancyCalendar(pregnancyStartDate, dueDate, pregnancyWeek, reverseCalendarElement, targetDate);
                }
                
                function showReverseError(title, message) {
                    modalTitle.textContent = title;
                    modalMessage.textContent = message;
                    errorModal.classList.add('show');
                }
            }
            
            function initCalendar() {
				const pregnancyMonthSelect = document.getElementById('pregnancy-month');
				if (pregnancyMonthSelect) {
					pregnancyMonthSelect.dispatchEvent(new Event('change'));
					// تعيين القيمة الافتراضية للأسبوع إلى الحد الأدنى للشهر المحدد
					const weekRange = monthToWeekRange[parseInt(pregnancyMonthSelect.value)];
					document.getElementById('pregnancy-week').value = weekRange.min;
				}
			}
            
            // Utility function to format dates as DD/MM/YYYY
// دالة مساعدة لتنسيق التواريخ كـ يوم/شهر/سنة
// استبدل دالة formatDate بهذه الدالة
function formatDate(date) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
            
            function getMonthName(monthIndex) {
                const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                               'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                return months[monthIndex];
            }

            function getPregnancyMonth(week) {
                if (week <= 4) return 1;
                if (week <= 8) return 2;
                if (week <= 13) return 3;
                if (week <= 17) return 4;
                if (week <= 21) return 5;
                if (week <= 26) return 6;
                if (week <= 30) return 7;
                if (week <= 35) return 8;
                if (week <= 40) return 9;
                return 0;
            }
            
            // Function to generate pregnancy calendar view
// دالة إنشاء عرض تقويم متابعة الحمل
function generatePregnancyCalendar(startDate, dueDate, currentWeek, calendarElement, targetDate = null) {
                calendarElement.innerHTML = '';
                
                // Calendar headers (starting with Saturday)
                const days = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
                days.forEach(day => {
                    const header = document.createElement('div');
                    header.className = 'calendar-header';
                    header.textContent = day;
                    calendarElement.appendChild(header);
                });
                
                // Calculate the start date for the calendar (previous Saturday)
                const startDayOfWeek = startDate.getDay();
                const daysToSubtract = (startDayOfWeek + 1) % 7;
                const calendarStartDate = new Date(startDate);
                calendarStartDate.setDate(startDate.getDate() - daysToSubtract);
                
                let lastPregnancyMonth = 0;

                for (let i = 0; i < PREGNANCY_WEEKS * 7 + daysToSubtract; i++) {
                    const currentDate = new Date(calendarStartDate);
                    currentDate.setDate(calendarStartDate.getDate() + i);
                    
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    
                    // Highlight important dates
                    if (currentDate.toDateString() === today.toDateString()) {
                        dayElement.classList.add('today');
                    }
                    if (currentDate.toDateString() === startDate.toDateString()) {
                        dayElement.classList.add('pregnancy-start');
                    }
                    if (currentDate.toDateString() === dueDate.toDateString()) {
                        dayElement.classList.add('due-date');
                    }
                    
                    // Highlight target date if provided
                    if (targetDate && currentDate.toDateString() === targetDate.toDateString()) {
                        dayElement.classList.add('current-week');
                    }
                    
                    // Calculate week of pregnancy for this date
                    const daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
                    const weekOfPregnancy = Math.floor(daysSinceStart / 7) + 1;
                    
                    // Highlight current week
                    if (weekOfPregnancy === currentWeek && daysSinceStart >= 0) {
                        dayElement.classList.add('current-week');
                    }
                    
                    // Day number container
                    const dayNumberContainer = document.createElement('div');
                    dayNumberContainer.className = 'day-number-container';
                    
                    const dayNumberDiv = document.createElement('div');
                    dayNumberDiv.className = 'day-number';
                    dayNumberDiv.textContent = currentDate.getDate();
                    dayNumberContainer.appendChild(dayNumberDiv);
                    
                    // Add week label if first day of week
                    if (daysSinceStart >= 0 && daysSinceStart % 7 === 0) {
                        const weekLabel = document.createElement('div');
                        weekLabel.className = 'week-label';
                        weekLabel.textContent = `الأسبوع ${weekOfPregnancy}`;
                        dayNumberContainer.appendChild(weekLabel);
                    }
                    
                    dayElement.appendChild(dayNumberContainer);
                    
                    // Day info container
                    const dayInfoContainer = document.createElement('div');
                    dayInfoContainer.className = 'day-info-container';
                    
                    // Pregnancy month label
                    if (daysSinceStart >= 0) {
                        const pregnancyMonth = getPregnancyMonth(weekOfPregnancy);
                        if (pregnancyMonth > lastPregnancyMonth) {
                            const monthLabel = document.createElement('div');
                            monthLabel.className = 'pregnancy-month-label';
                            monthLabel.textContent = `الشهر ${pregnancyMonth}`;
                            dayInfoContainer.appendChild(monthLabel);
                            lastPregnancyMonth = pregnancyMonth;
                        }
                    }
                    
                    // Month and year display
                    const monthYear = document.createElement('div');
                    monthYear.className = 'month-year';
                    monthYear.textContent = `${getMonthName(currentDate.getMonth())}`;
                    
                    const yearDisplay = document.createElement('div');
                    yearDisplay.className = 'year-display';
                    yearDisplay.textContent = `${currentDate.getFullYear()}`;
                    
                    dayInfoContainer.appendChild(monthYear);
                    dayInfoContainer.appendChild(yearDisplay);
                    
                    dayElement.appendChild(dayInfoContainer);
                    
                    calendarElement.appendChild(dayElement);
                }
            }
            
            // Initial calculation on page load
            // احذف هذا السطر من نهاية الدالة DOMContentLoaded
// document.getElementById('calculate-btn').click();

// بدلاً من ذلك، سنقوم بتعطيل الزر حتى يتم اختيار تاريخ
document.addEventListener('DOMContentLoaded', function() {
    // ... الكود السابق ...
    
    // تعطيل زر الحساب حتى يتم اختيار تاريخ
    document.getElementById('calculate-btn').disabled = true;
    document.getElementById('reverse-calculate-btn').disabled = true;
    
    // تمكين الأزرار عند اختيار تاريخ
    document.getElementById('date').addEventListener('change', function() {
        document.getElementById('calculate-btn').disabled = !this.value;
    });
    
    document.getElementById('target-date').addEventListener('change', function() {
        document.getElementById('reverse-calculate-btn').disabled = !this.value;
    });
    
    // ... بقية الكود ...
});
        });
// أضف هذه الدوال في نهاية DOMContentLoaded
function resetDirectTab() {
    document.getElementById('date').value = '';
    document.getElementById('lmp').checked = true;
    document.getElementById('pregnancy-start-date').textContent = '--/--/----';
    document.getElementById('due-date').textContent = '--/--/----';
    document.getElementById('current-week').textContent = '--';
    document.getElementById('display-current-week').textContent = '--';
    document.getElementById('pregnancy-progress').style.width = '0%';
    document.getElementById('pregnancy-calendar').innerHTML = '';
}

function resetReverseTab() {
    document.getElementById('target-date').value = '';
    document.getElementById('pregnancy-month').value = '1';
    document.getElementById('pregnancy-week').value = '1';
    document.getElementById('week-day').value = '1';
    document.getElementById('reverse-pregnancy-start-date').textContent = '--/--/----';
    document.getElementById('reverse-due-date').textContent = '--/--/----';
    document.getElementById('reverse-target-date').textContent = '--/--/----';
    document.getElementById('reverse-info').textContent = 'ستكونين في الأسبوع -- من الحمل، يوم -- من الأسبوع';
    document.getElementById('reverse-month-info').textContent = 'في الشهر -- من الحمل';
    document.getElementById('reverse-pregnancy-progress').style.width = '0%';
    document.getElementById('reverse-pregnancy-calendar').innerHTML = '';
}

// أضف مستمعي الأحداث
document.getElementById('reset-btn-direct').addEventListener('click', resetDirectTab);
document.getElementById('reset-btn-reverse').addEventListener('click', resetReverseTab);

// أضف هذه الدوال لطباعة النتائج
function printDirectResults() {
    const printContent = document.getElementById('direct-tab').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="direction: rtl; text-align: center; padding: 20px;">
            <h2>تقرير متابعة الحمل</h2>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}

function printReverseResults() {
    const printContent = document.getElementById('reverse-tab').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="direction: rtl; text-align: center; padding: 20px;">
            <h2>تقرير متابعة الحمل - حساب عكسي</h2>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}

// أضف مستمعي الأحداث
document.getElementById('print-btn-direct').addEventListener('click', printDirectResults);
document.getElementById('print-btn-reverse').addEventListener('click', printReverseResults);