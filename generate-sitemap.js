const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const domain = 'https://www.infinitycat.site'; // domain thật của bạn

// List tất cả routes trong App.tsx
const routes = [
    '/',
    '/register',
    '/login',
    '/verify-email',
    '/verify-success',
    '/verify-confirmation',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
    '/oauth2/success',
    '/purchase',
    '/invoice',
    '/order-history',
    '/client/course',
    '/client/course/:languageName', // bạn có thể bỏ dấu :id vì sitemap nên là link cụ thể
    '/client/detail/:id',
    '/student/course/:id',
    '/student/dashboard',
    '/student/learn/:courseId',
    '/sepay-payment',
    '/admin/dashboard',
    '/admin/languages',
    '/admin/languages/create',
    '/404' // not found
];

// Nếu bạn muốn bỏ các dynamic route (:id, :courseId) thì chỉ cần xóa.
// Nếu có danh sách course/blog dynamic => cần fetch từ API và push vào đây.

async function generateSitemap() {
    const sitemap = new SitemapStream({ hostname: domain });

    routes.forEach((url) => {
        sitemap.write({ url, changefreq: 'weekly', priority: 0.7 });
    });

    sitemap.end();

    const sitemapXML = await streamToPromise(sitemap);
    const writeStream = createWriteStream('./public/sitemap.xml');
    writeStream.write(sitemapXML.toString());
    writeStream.end();
}

generateSitemap();
