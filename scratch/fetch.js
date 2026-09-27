const url = "http://localhost:3000/api/pengajuanskema/50/riwayat-asesmen";
fetch(url)
  .then(r => r.json())
  .then(d => {
      d.data.forEach(item => {
        if (item.form_type === 'FR.IA.04A') {
          console.log("IA.04A:", JSON.stringify(item.form_data, null, 2));
        }
      });
  })
  .catch(console.error);
