const supabaseurl = 'https://ohtmcodctiyawsgdrjuy.supabase.co'
const supabasekey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odG1jb2RjdGl5YXdzZ2RyanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDg3ODcsImV4cCI6MjEwNzM4NDc4N30.ksKD6trl2YUUAfuuoMC3yyqPJhvzLvaCGM1n9BB_2NA'
const _supabase = window.supabase.createClient(supabaseurl, supabasekey)
// دالة تتحقق من تسجيل الدخول وتعيد التوجيه إذا لم يكن المستخدم مسجلاً الدخول
async function checkAdminAuth() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!user) {
        // إذا لم يكن هناك مستخدم مسجّل الدخول، أعد التوجيه إلى صفحة تسجيل الدخول
        window.location.href = "login.html";
        return
    }
}

// نفذ الدالة تلقائياً عند تحميل الصفحة
checkAdminAuth();

async function loadrequests() {
    const container = document.getElementById('product-container')
    const {data: requests, error } = await _supabase.from('requests').select('*').eq('status', 'قيد الانتظار').order('created_at', { ascending: false })
if (error) {
    container.innerHTML = '<p>فشل تحميل الطلبات</p>';
    return;
}
if (!requests || requests.length === 0) {
    container.innerHTML = '<p>لا توجد طلبات</p>';
    return;
}
container.innerHTML = '';
requests.forEach(req => {
    if (req.service_type === 'مشاهد') {
        container.innerHTML += `
            <div class="cart">
                <h3>طلب مشاهد</h3>
                <p>الاسم: ${req.first_name} ${req.second_name}</p>
                <p>الحالة: ${req.status}</p>
                <div class="button-row">
                 <button onclick="updateStatus('${req.id}', 'مقبول ✅')"
                    style="background-color: #2ecc71; color: white; border: none; padding: 15px; border-radius: 15px; margin-left: 5px; cursor:pointer;">
                    قبول
                </button>
                <button onclick="updateStatus('${req.id}', 'مرفوض ❌')"
                    style="background-color: #e74c3c; color: white; border: none; padding: 10px; border-radius: 15px; cursor:pointer;">
                    رفض
                </button>
                </div>
            </div>
        `;
    } else {
        let imgHtml = '';
        if (req.certf_path) {
          const { data: urldata } = _supabase
            .storage
            .from('images')
            .getPublicUrl(req.certf_path);
          imgHtml = `<img src="${urldata.publicUrl}" width="200">`;
        }
  
        container.innerHTML += `
        <div class="cart">
          <h3>طلب متسابق</h3>
          <p>طريقة الدفع: ${req.selected_method}</p>
          <p>الاسم: ${req.first_name} ${req.second_name}</p>
          <p>العمر: ${req.age}</p>
          <p>نوع السيارة: ${req.type}</p>
          <p>الحالة: ${req.status}</p>
          ${imgHtml}
          <div class="button-row">
            <button onclick="updateStatus('${req.id}', 'مقبول ✅')"
                    style="background-color: #2ecc71; color: white; border: none; padding: 15px; border-radius: 15px; margin-left: 5px; cursor:pointer;">
                    قبول
                </button>
                <button onclick="updateStatus('${req.id}', 'مرفوض ❌')"
                    style="background-color: #e74c3c; color: white; border: none; padding: 15px; border-radius: 15px; cursor:pointer;">
                    رفض
                </button>
                </div>

        </div>
      `;
    }
});
}
async function updateStatus(id, newStatus) {
    const { error } = await _supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        alert('حدث خطأ أثناء تحديث الحالة');
        console.error(error);
    }
}
_supabase.channel('realtime').on('postgres_changes',{ event: '*', schema: 'public', table: 'requests' }, (payload) => {
          loadrequests()
        }
    )
    .subscribe()
    loadrequests()