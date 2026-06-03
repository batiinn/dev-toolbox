export interface HttpStatus {
  code: number
  name: { tr: string; en: string }
  desc: { tr: string; en: string }
}

export const HTTP_STATUS: HttpStatus[] = [
  { code: 100, name: { tr: 'Devam Et', en: 'Continue' }, desc: { tr: 'İstek başlığı alındı, istemci gövdeyi göndermeye devam edebilir.', en: 'Request headers received; the client may continue with the body.' } },
  { code: 101, name: { tr: 'Protokol Değişimi', en: 'Switching Protocols' }, desc: { tr: 'Sunucu istemcinin istediği protokole geçiyor (örn. WebSocket).', en: 'Server is switching to the protocol requested by the client (e.g. WebSocket).' } },
  { code: 200, name: { tr: 'Başarılı', en: 'OK' }, desc: { tr: 'İstek başarıyla tamamlandı.', en: 'The request succeeded.' } },
  { code: 201, name: { tr: 'Oluşturuldu', en: 'Created' }, desc: { tr: 'İstek başarılı oldu ve yeni bir kaynak oluşturuldu.', en: 'The request succeeded and a new resource was created.' } },
  { code: 202, name: { tr: 'Kabul Edildi', en: 'Accepted' }, desc: { tr: 'İstek alındı ama henüz işlenmedi.', en: 'The request was received but not yet acted upon.' } },
  { code: 204, name: { tr: 'İçerik Yok', en: 'No Content' }, desc: { tr: 'Başarılı; döndürülecek içerik yok.', en: 'Success, with no content to return.' } },
  { code: 206, name: { tr: 'Kısmi İçerik', en: 'Partial Content' }, desc: { tr: 'Range başlığı nedeniyle kaynağın bir kısmı döndürüldü.', en: 'Part of the resource is returned due to a Range header.' } },
  { code: 301, name: { tr: 'Kalıcı Taşındı', en: 'Moved Permanently' }, desc: { tr: 'Kaynak kalıcı olarak yeni bir adrese taşındı.', en: 'The resource has permanently moved to a new URL.' } },
  { code: 302, name: { tr: 'Geçici Yönlendirme', en: 'Found' }, desc: { tr: 'Kaynak geçici olarak farklı bir adreste.', en: 'The resource is temporarily at a different URL.' } },
  { code: 304, name: { tr: 'Değiştirilmedi', en: 'Not Modified' }, desc: { tr: 'Önbellekteki sürüm hâlâ geçerli.', en: 'The cached version is still valid.' } },
  { code: 307, name: { tr: 'Geçici Yönlendirme', en: 'Temporary Redirect' }, desc: { tr: 'Geçici yönlendirme; metot korunur.', en: 'Temporary redirect; the method is preserved.' } },
  { code: 308, name: { tr: 'Kalıcı Yönlendirme', en: 'Permanent Redirect' }, desc: { tr: 'Kalıcı yönlendirme; metot korunur.', en: 'Permanent redirect; the method is preserved.' } },
  { code: 400, name: { tr: 'Hatalı İstek', en: 'Bad Request' }, desc: { tr: 'Sunucu isteği geçersiz söz dizimi nedeniyle anlayamadı.', en: 'The server could not understand the request due to invalid syntax.' } },
  { code: 401, name: { tr: 'Yetkisiz', en: 'Unauthorized' }, desc: { tr: 'Kimlik doğrulaması gerekli veya başarısız.', en: 'Authentication is required or has failed.' } },
  { code: 403, name: { tr: 'Yasak', en: 'Forbidden' }, desc: { tr: 'Erişim hakkın yok; kimlik doğrulama durumu değiştirmez.', en: 'You do not have access; authenticating will not help.' } },
  { code: 404, name: { tr: 'Bulunamadı', en: 'Not Found' }, desc: { tr: 'İstenen kaynak bulunamadı.', en: 'The requested resource was not found.' } },
  { code: 405, name: { tr: 'Metoda İzin Yok', en: 'Method Not Allowed' }, desc: { tr: 'HTTP metodu bu kaynak için desteklenmiyor.', en: 'The HTTP method is not supported for this resource.' } },
  { code: 408, name: { tr: 'İstek Zaman Aşımı', en: 'Request Timeout' }, desc: { tr: 'Sunucu isteği beklerken zaman aşımına uğradı.', en: 'The server timed out waiting for the request.' } },
  { code: 409, name: { tr: 'Çakışma', en: 'Conflict' }, desc: { tr: 'İstek kaynağın mevcut durumuyla çakışıyor.', en: 'The request conflicts with the current state of the resource.' } },
  { code: 410, name: { tr: 'Gitti', en: 'Gone' }, desc: { tr: 'Kaynak kalıcı olarak kaldırıldı.', en: 'The resource has been permanently removed.' } },
  { code: 413, name: { tr: 'İçerik Çok Büyük', en: 'Payload Too Large' }, desc: { tr: 'İstek gövdesi sunucunun sınırını aşıyor.', en: 'The request body is larger than the server allows.' } },
  { code: 415, name: { tr: 'Desteklenmeyen Tür', en: 'Unsupported Media Type' }, desc: { tr: 'İçerik türü sunucu tarafından desteklenmiyor.', en: 'The media type is not supported by the server.' } },
  { code: 422, name: { tr: 'İşlenemeyen Varlık', en: 'Unprocessable Entity' }, desc: { tr: 'İstek doğru ama anlamsal olarak işlenemedi (doğrulama hatası).', en: 'The request is well-formed but could not be processed (validation error).' } },
  { code: 429, name: { tr: 'Çok Fazla İstek', en: 'Too Many Requests' }, desc: { tr: 'Hız sınırı aşıldı; daha sonra tekrar dene.', en: 'Rate limit exceeded; try again later.' } },
  { code: 500, name: { tr: 'Sunucu Hatası', en: 'Internal Server Error' }, desc: { tr: 'Sunucuda beklenmeyen bir hata oluştu.', en: 'The server encountered an unexpected error.' } },
  { code: 501, name: { tr: 'Uygulanmadı', en: 'Not Implemented' }, desc: { tr: 'Sunucu bu işlevi desteklemiyor.', en: 'The server does not support the requested functionality.' } },
  { code: 502, name: { tr: 'Hatalı Ağ Geçidi', en: 'Bad Gateway' }, desc: { tr: 'Yukarı akış sunucusundan geçersiz yanıt alındı.', en: 'Invalid response received from the upstream server.' } },
  { code: 503, name: { tr: 'Hizmet Kullanılamıyor', en: 'Service Unavailable' }, desc: { tr: 'Sunucu geçici olarak (bakım/aşırı yük) hizmet veremiyor.', en: 'The server is temporarily unavailable (maintenance/overload).' } },
  { code: 504, name: { tr: 'Ağ Geçidi Zaman Aşımı', en: 'Gateway Timeout' }, desc: { tr: 'Yukarı akış sunucusu zamanında yanıt vermedi.', en: 'The upstream server did not respond in time.' } },
]
