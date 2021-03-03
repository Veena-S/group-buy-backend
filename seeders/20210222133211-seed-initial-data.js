const jsSHA = require('jssha');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update('password');
    const hashedPassword = shaObj.getHash('HEX');
    const usersList = [
      {
        username: 'user1',
        email: 'user1@gmail.com',
        handphone_num: '+6589891234',
        password: hashedPassword,
        reputation: 30,
        created_at: new Date(),
        updated_at: new Date(),
      }, {
        username: 'user2',
        email: 'user2@gmail.com',
        handphone_num: '+6587459621',
        password: hashedPassword,
        reputation: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const arrOfListings = [];

    const arrOfDiscounts = [0.2, 0.3, 0.4];
    const arrOfListingStatuses = ['below-moq', 'above-moq', 'cancelled', 'completed'];
    const arrOfPurchaseStatuses = ['committed', 'activated', 'pending fulfillment', 'fulfilled', 'cancelled'];
    const arrOfPaymentStatuses = ['processing', 'paid', 'refunded'];

    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    for (let i = 0; i < 6; i += 1) {
      // $1 to $5
      const usualPriceAmt = Math.floor(Math.random() * 5) + 1;
      const startDate = new Date(faker.date.future());

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);

      const deliveryDate = new Date(endDate);
      deliveryDate.setDate(deliveryDate.getDate() + 7);

      const randDiscountPrice = Number((arrOfDiscounts[Math.floor(Math.random() * arrOfDiscounts.length)]
         * usualPriceAmt).toFixed(2));

      const listing = {
        // title
        title: faker.hacker.noun(),

        // description
        description: faker.lorem.paragraph(),

        // img
        images: JSON.stringify({
          img1: faker.image.imageUrl(),
          img2: faker.image.imageUrl(),
          img3: faker.image.imageUrl(),
        }),

        // quantity (random num) //10 to 19
        quantity: Math.floor(Math.random() * 10) + 10,

        // quantity remaining( random num) // 1-9
        quantity_remaining: Math.floor(Math.random() * 10),

        // moq (random num) // 1 to 5
        moq: Math.floor(Math.random() * 5) + 1,

        // Whether a lister's listing can go beyond its goal set
        allow_oversubscription: false,

        // usual_price (rand num)
        usual_price: usualPriceAmt,

        // discount_price
        discounted_price: randDiscountPrice,

        // start faker.date.future
        start_date: startDate,

        // end date = startDate.date() + 14days
        end_date: endDate,

        // delivery date = endDate + 7 days
        delivery_date: deliveryDate,

        // modulo index if even -> pickup odd -> electronic
        delivery_mode: (i % 2 === 0 ? 'pickup' : 'electronic'),
        // tnc: 'Some text'
        tnc: faker.lorem.paragraph(),

        // category modulo index if even -> food odd -> clothes
        category: (i % 2 === 0 ? 'food' : 'clothes'),

        // random Number for lister_id
        lister_id: Math.floor(Math.random() * 2) + 1,

        // listing_status
        listing_status: arrOfListingStatuses[Math.floor(Math.random() * arrOfListingStatuses.length)],
        created_at: new Date(),
        updated_at: new Date(),
      };
      arrOfListings.push(listing);
    }

    const arrOfPurchases = [];

    for (let i = 0; i < 10; i += 1) {
      const singleDate = new Date();
      singleDate.setDate(singleDate.getDate() - i);
      const purchase = {
        listing_id: Math.floor(Math.random() * 6) + 1,
        qty: Math.floor(Math.random() * 3) + 1,
        purchaser_id: Math.floor(Math.random() * 2) + 1,
        purchase_status: arrOfPurchaseStatuses[Math.floor(Math.random() * arrOfPurchaseStatuses.length)],
        payment_receipt: 'https://www.citibank.com.sg/gcb/otherservices/images/paynow/step-4.jpg',
        receipt_upload_date: randomDate(new Date(2020, 0, 1), new Date()),
        payment_status: arrOfPaymentStatuses[Math.floor(Math.random() * arrOfPaymentStatuses.length)],
        // dummy values
        amt_refunded: 0,
        refund_tier: '2',
        date_delivered: null,
        created_at: singleDate,
        updated_at: singleDate,
      };
      for (let j = 0; j < 5; j += 1) {
        arrOfPurchases.push(purchase);
      }
    }

    await queryInterface.bulkInsert('users', usersList);
    await queryInterface.bulkInsert('listings', arrOfListings);
    await queryInterface.bulkInsert('purchases', arrOfPurchases);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('purchases', null, {});
    await queryInterface.bulkDelete('listings', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
