const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const wwebVersion = '2.2412.54';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.body === '!ping') {
        msg.reply('pong');
    }

    if (msg.body === 'bot baak') {
        const response = `Selamat Datang di Bot Akademik BAAK Gunadarma, silahkan ketik angka untuk melihat (misal: "1" untuk lihat Berita Terbaru BAAK"):\n\n`
                      + `1. Berita Terbaru BAAK\n`
                      + `2. Kalender Akademik\n`
                      + `3. Jadwal Kuliah\n`
                      + `4. Daftar Mata Kuliah\n`
                      + `5. Waktu Kuliah\n`
                      + `6. Jadwal Ujian\n`
                      + `7. Ujian Bentrok`;

        await msg.reply(response);
    }

    if (msg.body.toLowerCase() === '1') {
        try {
            const newsList = await fetchTop3LatestNews();

            let response = 'Berita Terbaru dari BAAK Gunadarma:\n';
            newsList.forEach((news, index) => {
                response += `${index + 1}. ${news.title}\n`;
                response += `   URL: ${news.url}\n`;
            });

            await client.sendMessage(msg.from, response);
        } catch (error) {
            console.error('Error sending latest news:', error);
            await client.sendMessage(msg.from, 'Terjadi kesalahan saat mengambil berita terbaru dari BAAK Gunadarma.');
        }
    }

    async function fetchTop3LatestNews() {
        try {
            const url = 'https://baak.gunadarma.ac.id/';
            const response = await axios.get(url);
            const dom = new JSDOM(response.data);
    
            const newsLinks = dom.window.document.querySelectorAll('a[href*=berita]');
    
            if (newsLinks.length > 0) {
                let newsList = [];
                for (let i = 0; i < Math.min(3, newsLinks.length); i++) {
                    const link = newsLinks[i];
                    const newsTitle = link.textContent.trim();
                    const newsUrl = link.href;
                    newsList.push({ title: newsTitle, url: newsUrl });
                }
                return newsList;
            } else {
                throw new Error('Tidak ada elemen berita yang ditemukan.');
            }
        } catch (error) {
            console.error('Error fetching latest news:', error);
            throw new Error('Terjadi kesalahan saat mengambil berita terbaru dari halaman BAAK Gunadarma.');
        }
    }

    if (msg.body.toLowerCase() === '2') {
        try {
            const media = await MessageMedia.fromUrl('https://drive.usercontent.google.com/download?id=1PPc_tZxsoZZEcpeFy0Dyiq5Ti0QZBCQh&export=download&authuser=0&confirm=t&uuid=3f99191f-0f4e-4e07-85a8-0d3360d11e37&at=APZUnTU9mnDFgfyluuwWi8AgVNqK:1717805627892', {
                unsafeMime: true
            });
            await client.sendMessage(msg.from, media);
    
            // After sending the media, send the download link
            const downloadMessage = `Download PDF: https://baak.gunadarma.ac.id/downloadAkademik/9`;
            await client.sendMessage(msg.from, downloadMessage);
        } catch (error) {
            console.error('Error sending media:', error);
            await client.sendMessage(msg.from, 'Terjadi kesalahan saat mengirim Kalender Akademik.');
        }
    }

    if (msg.body.toLowerCase() === '3') {
        msg.reply('Silahkan ketik kelas yang ingin Anda lihat jadwalnya (contoh: 3ka30)');
    }

    if (msg.body.toLowerCase() === '3ka29') {
        try {
            const media = await MessageMedia.fromUrl('https://drive.usercontent.google.com/download?id=1OhYqKqRqJnKsXwwSGXhyW2LcXomcOrjD&export=download&authuser=0&confirm=t&uuid=8e694295-0954-4666-a64b-a4f1119b0073&at=APZUnTXnGh_EeEKh_xG69jgKx3tO:1718514378703', {
                unsafeMime: true
            });
            await client.sendMessage(msg.from, media);
        } catch (error) {
            console.error('Error sending media:', error);
            await client.sendMessage(msg.from, 'Terjadi kesalahan saat mengirim jadwal perkuliahan untuk kelas 3ka29.');
        }
    }

    if (msg.body.toLowerCase() === '3ka30') {
        try {
            const media = await MessageMedia.fromUrl('https://drive.usercontent.google.com/download?id=1BvT1qws0o1jPsux1rmfRGYvbdjn_u2Qn&export=download&authuser=0&confirm=t&uuid=20afc83d-d758-42fd-81f7-5fc859a8aebc&at=APZUnTXM8jFbXWh5lpGaUImzmWrx:1718514408312', {
                unsafeMime: true
            });
            await client.sendMessage(msg.from, media);
        } catch (error) {
            console.error('Error sending media:', error);
            await client.sendMessage(msg.from, 'Terjadi kesalahan saat mengirim jadwal perkuliahan untuk kelas 3ka30.');
        }
    }

    if (msg.body.toLowerCase() === '3ka31') {
        try {
            const media = await MessageMedia.fromUrl('https://drive.usercontent.google.com/download?id=1nmhGz146XxMx0O3q2pcXkTZI48CYv_U5&export=download&authuser=0&confirm=t&uuid=a84b082d-48a2-4fe7-9812-f0be082e90df&at=APZUnTVyA3JOjbrxP5vEmudft3K_:1718514446893', {
                unsafeMime: true
            });
            await client.sendMessage(msg.from, media);
        } catch (error) {
            console.error('Error sending media:', error);
            await client.sendMessage(msg.from, 'Terjadi kesalahan saat mengirim jadwal perkuliahan untuk kelas 3ka31.');
        }
    }

    if (msg.body.toLowerCase() === '4') {
        try {
            const mataKuliahList = await fetchMataKuliah();

            let response = 'Daftar Mata Kuliah Yang Ada Di Universitas Gunadarma:\n';
            mataKuliahList.forEach((mataKuliah, index) => {
                response += `${index + 1}. ${mataKuliah.title}\n`;
                response += `   URL: ${mataKuliah.url}\n`;
            });

            await client.sendMessage(msg.from, response);
        } catch (error) {
            console.error('Error sending mata kuliah list:', error);
            await client.sendMessage(msg.from, 'Terjadi kesalahan saat mengambil daftar mata kuliah dari BAAK Gunadarma.');
        }
    }

    async function fetchMataKuliah() {
        try {
            const url = 'https://baak.gunadarma.ac.id/kuliahUjian/2#undefined2';
            const response = await axios.get(url);
            const dom = new JSDOM(response.data);
    
            const mataKuliahLinks = dom.window.document.querySelectorAll('ul.list.list-unstyled.list-marked li a');
    
            if (mataKuliahLinks.length > 0) {
                let mataKuliahList = [];
                mataKuliahLinks.forEach(link => {
                    const mataKuliahTitle = link.textContent.trim();
                    const mataKuliahUrl = link.href;
                    mataKuliahList.push({ title: mataKuliahTitle, url: mataKuliahUrl });
                });
                return mataKuliahList;
            } else {
                throw new Error('Tidak ada elemen mata kuliah yang ditemukan.');
            }
        } catch (error) {
            console.error('Error fetching mata kuliah:', error);
            throw new Error('Terjadi kesalahan saat mengambil daftar mata kuliah dari halaman BAAK Gunadarma.');
        }
    }

    if (msg.body.toLowerCase() === '5') {
        try {
            const scheduleMessage = await fetchClassSchedule();
            await client.sendMessage(msg.from, 'Waktu Kuliah:\n' + scheduleMessage);
        } catch (error) {
            console.error('Error sending class schedule:', error);
            await client.sendMessage(msg.from, 'Terjadi kesalahan saat mengambil waktu kuliah dari BAAK Gunadarma.');
        }
    }

    async function fetchClassSchedule() {
        try {
            const url = 'https://baak.gunadarma.ac.id/kuliahUjian/5#undefined6';
            const response = await axios.get(url);
            const dom = new JSDOM(response.data);
    
            const rows = dom.window.document.querySelectorAll('table.table.table-custom.table-primary.table-fixed.stacktable.cell-xs-6 tbody tr');
    
            if (rows.length > 0) {
                let scheduleMessage = '';
                rows.forEach((row, index) => {
                    if (index === 0) return; // Skip header row
    
                    const columns = row.querySelectorAll('td');
                    if (columns.length === 2) {
                        const jamKe = columns[0].textContent.trim();
                        const waktu = columns[1].textContent.trim();
                        scheduleMessage += `${jamKe} | ${waktu}\n`;
                    }
                });
                return scheduleMessage;
            } else {
                throw new Error('Tidak ada data waktu kuliah yang ditemukan.');
            }
        } catch (error) {
            console.error('Error fetching class schedule:', error);
            throw new Error('Terjadi kesalahan saat mengambil data waktu kuliah dari halaman BAAK Gunadarma.');
        }
    }

    if (msg.body.toLowerCase() === '6') {
        const jadwalUjianText = `
    Tiga minggu sebelum Ujian Tengah Semester / Akhir Semester dimulai, BAAK (dalam hal ini Bagian Ujian) mengumumkan Jadwal Ujian Tengah Semester / Akhir Semester per kelas untuk setiap Jenjang / Jurusan / Fakultas. Jadwal Ujian ini dapat dilihat pada BAAK On_Line atau ditempel di papan pengumuman di kampus C, D, E dan G. Jadwal Ujian juga dapat ditanyakan di loket pelayanan BAAK atau di Sekretariat Dosen di tiap-tiap kampus.
    
    Bersamaan dengan pengumuman Jadwal Ujian, akan diumumkan juga tentang Tata Tertib Ujian dan Pengumuman lain yang berhubungan dengan ujian (misalnya batas waktu pelaporan ujian bentrok).
    
    Hal-Hal yang Berkaitan dengan Ujian :
    
    Presensi Kuliah
    Setiap mahasiswa diijinkan mengikuti ujian suatu mata kuliah jika ia hadir sekurang kurangnya 70% dari kegiatan kuliah tersebut.
    
    Tata Tertib Ujian
    Tata Tertib Ujian berisi aturan yang berlaku selama ujian berlangsung. Tata Tertib Ujian dapat dilihat di BAAK On_Line dan juga ditempel bersamaan dengan pengumuman jadwal ujian, dan ditempelkan juga di setiap ruang ujian, dan dibacakan pada setiap sesi ujian sebelum ujian berlangsung. Setiap mahasiswa wajib memperhatikan dan mentaati Tata Tertib Ujian ini.
    
    Ujian Susulan
    Setiap mahasiswa wajib mengikuti ujian sesuai dengan jadwal. Mahasiswa yang tidak hadir pada waktu ujian, karena sesuatu hal, dinyatakan batal ujian. Ujian susulan atau ujian tersendiri di luar jadwal yang telah ditentukan, hanya dipertimbangkan untuk diselenggarakan, jika ada kasus yang sangat khusus. Kasus sangat khusus dan prosedur pengajuan ujian susulan tersebut dapat dilihat pada Prosedur Ujian Susulan.
    
    Jadwal Ujian Bentrok
    Mahasiswa yang mengambil mata kuliah di kelas yang lebih atas atau mengulang di kelas yang lebih bawah, ada kemungkinan jadwal ujiannya bentrok (dua atau lebih mata ujian bersamaan waktu ujiannnya). Bagi mahasiswa yang jadwal ujiannya bentrok, maka wajib melapor dan mengisi formulir yang disediakan oleh BAAK dengan batas waktu yang ditentukan (batas waktu dan syarat pelaporan dapat dilihat pada pengumuman).
    `;
    
        await client.sendMessage(msg.from, jadwalUjianText.trim());
    }

    if (msg.body.toLowerCase() === '7') {
        const output = getUjianBentrokProcedure(msg.body);
        await client.sendMessage(msg.from, output);
    }

    function getUjianBentrokProcedure(input) {
        if (input.toLowerCase() === "7") {
            return `
    Mahasiswa yang mengambil mata kuliah di kelas yang lebih atas atau mengulang di kelas yang lebih bawah, ada kemungkinan jadwal ujiannya bentrok (dua atau lebih mata ujian bersamaan waktu ujiannya). Bagi mahasiswa yang jadwal ujiannya bentrok, wajib melapor dan mengisi formulir yang disediakan oleh BAAK sesuai dengan batas waktu yang ditentukan.
    
    Prosedur Pengurusan Ujian Bentrok
    
    1. Isilah form pengurusan ujian bentrok dengan lengkap dan benar (kesalahan pengisian tidak menjadi tanggung jawab BAAK).
    2. Jika dalam satu hari terdapat lebih dari dua mata ujian, isilah seluruh jadwal ujian yang akan diikuti pada hari tersebut.
    3. Periksalah kembali data isian anda.
    4. Setelah mengisi form, perhatikan petunjuk untuk langkah selanjutnya.
    5. Untuk pengambilan surat keterangan ujian bentrok di loket BAAK, diwajibkan membawa 'lembar pengisian form online'.
    6. Jadual dapat diambil satu hari sebelum ujian dimulai di BAAK (Loket 3).
    7. Selama ujian berlangsung jadual dapat diambil di Gedung 3 Lantai 1, Kampus E (Sekretariat Dosen / Panitia Ujian).
    `;
        } else {
            return "Input tidak valid. Mohon masukkan kata kunci 'ujian bentrok' untuk melihat prosedur pengurusan ujian bentrok.";
        }
    }
});

client.initialize();
