'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create Events
    await queryInterface.bulkInsert('Events', [
      {
        id: 1,
        title: 'Pemilihan BEM Universitas 2025',
        description: 'Pemilihan Badan Eksekutif Mahasiswa periode 2025-2026. Mari pilih pemimpin yang akan membawa perubahan positif untuk seluruh mahasiswa.',
        start_date: new Date('2025-08-20T09:00:00Z'),
        end_date: new Date('2025-08-20T17:00:00Z'),
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Pemilihan Ketua HIMA Teknik Informatika',
        description: 'Pemilihan Ketua Himpunan Mahasiswa Teknik Informatika periode 2025-2026. Tentukan masa depan teknologi di kampus kita.',
        start_date: new Date('2025-08-21T08:00:00Z'),
        end_date: new Date('2025-08-21T16:00:00Z'),
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Create Candidates for BEM Election (Event ID: 1)
    await queryInterface.bulkInsert('Candidates', [
      {
        id: 1,
        event_id: 1,
        name: 'Ahmad Rizki Pratama',
        nim: '2021001',
        photo_url: '/images/user/user-01.png',
        vision: 'Membangun BEM yang inklusif, inovatif, dan dekat dengan mahasiswa. BEM harus menjadi rumah bagi semua mahasiswa tanpa memandang latar belakang.',
        mission: 'Meningkatkan program kemahasiswaan, fasilitas kampus, dan kesejahteraan mahasiswa melalui kerjasama dengan berbagai pihak.',
        faculty: 'Fakultas Teknik',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        event_id: 1,
        name: 'Sari Dewi Lestari',
        nim: '2021002',
        photo_url: '/images/user/user-02.png',
        vision: 'BEM sebagai wadah aspirasi dan kreativitas mahasiswa, menghadirkan inovasi dalam setiap program kerja dan kegiatan.',
        mission: 'Mendorong partisipasi aktif mahasiswa dalam kegiatan kampus, membuka ruang dialog, dan menciptakan ekosistem mahasiswa yang produktif.',
        faculty: 'Fakultas Ekonomi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        event_id: 1,
        name: 'Muhammad Fajar Sidik',
        nim: '2021003',
        photo_url: '/images/user/user-03.png',
        vision: 'Transformasi digital BEM untuk pelayanan yang lebih efisien, transparan, dan mudah diakses oleh seluruh mahasiswa.',
        mission: 'Implementasi teknologi dalam setiap program kerja BEM, digitalisasi layanan mahasiswa, dan pengembangan platform inovasi.',
        faculty: 'Fakultas Teknik Informatika',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Candidates for HIMA TI Election (Event ID: 2)
    await queryInterface.bulkInsert('Candidates', [
      {
        id: 4,
        event_id: 2,
        name: 'Budi Santoso',
        nim: '2022001',
        photo_url: '/images/user/user-04.png',
        vision: 'HIMA TI yang solid, berprestasi, dan menjadi kebanggaan mahasiswa Teknik Informatika di tingkat nasional.',
        mission: 'Mengembangkan soft skill dan hard skill anggota HIMA TI melalui pelatihan, kompetisi, dan kerjasama industri.',
        faculty: 'Fakultas Teknik Informatika',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        event_id: 2,
        name: 'Indira Putri Maharani',
        nim: '2022002',
        photo_url: '/images/user/user-05.png',
        vision: 'HIMA TI sebagai pioneer inovasi teknologi di kampus, menciptakan startup dan komunitas tech yang berkelanjutan.',
        mission: 'Membangun ekosistem startup, tech community, dan inkubator bisnis teknologi untuk mahasiswa Teknik Informatika.',
        faculty: 'Fakultas Teknik Informatika',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Voting demo data seeded successfully!');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Candidates', null, {});
    await queryInterface.bulkDelete('Events', null, {});
  }
};
