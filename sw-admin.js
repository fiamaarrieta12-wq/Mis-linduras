// Service worker del panel: recibe las notificaciones push de turnos nuevos
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data.json()}catch(_){}
  e.waitUntil(self.registration.showNotification(d.title||'Mis Linduras',{
    body:d.body||'Hay un turno nuevo',icon:'icons/icon-192.png',badge:'icons/icon-192.png',data:{url:d.url||'admin.html'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if(c.url.includes('admin')&&'focus'in c)return c.focus()}
    return clients.openWindow(e.notification.data.url);
  }));
});
