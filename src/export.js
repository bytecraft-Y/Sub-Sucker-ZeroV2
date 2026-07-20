chrome.storage.local.get(['extractedData'], (result) => {
  const channels = result.extractedData || [];
  
  const metaDiv = document.getElementById('meta-info');
  metaDiv.innerHTML = `
    Targets Acquired: <span class="highlight">${channels.length} Subscriptions</span> <br>
    Timestamp: <span class="highlight">${new Date().toLocaleString()}</span>
  `;

  const tbody = document.getElementById('channel-list');
  let listItems = '';
  
  // Render Rows with Visual Telemetry (Avatars)
  channels.forEach((channel, index) => {
    const avatarSrc = channel.avatar || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    
    listItems += `
      <tr class="target-row">
        <td class="id-col">[${index + 1}]</td>
        <td class="avatar-col"><img src="${avatarSrc}" class="avatar-img" /></td>
        <td class="name-col"><a href="${channel.url}" target="_blank">${channel.name}</a></td>
        <td class="link-col"><a class="action-link" href="${channel.url}" target="_blank">[OPEN]</a></td>
      </tr>
    `;
  });
  
  tbody.innerHTML = listItems;

  // --- TARGET LOCATOR (LIVE SEARCH FILTER) ---
  document.getElementById('search-bar').addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.target-row');
    
    rows.forEach(row => {
      const channelName = row.querySelector('.name-col').textContent.toLowerCase();
      if (channelName.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // --- EXPORT TO PDF ---
  document.getElementById('print-action-btn').addEventListener('click', () => {
    window.print();
  });
});