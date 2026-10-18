const supabaseurl = 'https://ohtmcodctiyawsgdrjuy.supabase.co'
const supabasekey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odG1jb2RjdGl5YXdzZ2RyanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDg3ODcsImV4cCI6MjEwNzM4NDc4N30.ksKD6trl2YUUAfuuoMC3yyqPJhvzLvaCGM1n9BB_2NA'
const _supabase = window.supabase.createClient(supabaseurl, supabasekey)
async function loadMyRequests() {
    let ids = JSON.parse(localStorage.getItem('myrequests')) || [];
    if (ids.length === 0) {
      document.getElementById('requests-list').innerHTML = 
        '<p>لا يوجد طلبات</p>';
      return;
    }
    const { data, error } = await _supabase
      .from('requests')
      .select('*')
      .in('unique_id', ids);
    if (error) {
      console.error(error);
      document.getElementById('product-container').innerHTML = 
        '<p>فشل تحميل الطلبات</p>';
      return;
    }

    displayRequests(data);
  }
  
  function displayRequests(requests) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
  
    requests.forEach(req => {
      if (req.service_type === 'مشاهد') {
        container.innerHTML += `
          <div class="cart">
            <h3>طلب مشاهد</h3>
            <p>الاسم: ${req.first_name} ${req.second_name}</p>
            <p>طريقة الدفع: ${req.selected_method}</p>
             <p>كود التحقق: ${req. verification_code}</p>
            <p>الحالة: ${req.status}</p>
          </div>
        `;
      }else {
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
          <p>كود التحقق: ${req. verification_code}</p>
          <p>الحالة: ${req.status}</p>
          ${imgHtml}
        </div>
      `;
      
      }
    });
  }
_supabase.channel('realtime').on('postgres_changes', {event: '*', schema: 'public', table: 'requests'}, (payload) => {
    loadMyRequests()
}).subscribe()
loadMyRequests()