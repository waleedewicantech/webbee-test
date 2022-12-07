import Sequelize, { literal, QueryInterface } from 'sequelize';

export default {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * movie(id, name, genre)
   * showroom(id, name, regular_seat_price)
   * showtimes(id, movie_id, show_room, timefrom, timeto, no_of_seats, seats_available)/
   * pricing_scheme(id, name, price_markup, markup_type)
   * seating_map(id, seat_addr, showroom_id, pricing_scheme, seat_category);
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I don't want to configure the seating for every show
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // throw new Error('TODO: implement migration in task 4');
    //   * movie(id, name, genre)
    //  * showroom(id, name, regular_seat_price)
    //  * showtimes(id, movie_id, show_room, timefrom, timeto, no_of_seats, seats_available)/
    //  * pricing_scheme(id, name, price_markup, markup_type)
    //  * seating_map(id, seat_addr, showroom_id, pricing_scheme, seat_category);
    await queryInterface.createTable('Showroom', {
      name: Sequelize.DataTypes.STRING,
      regular_seat_price: {
        type: Sequelize.DataTypes.DECIMAL,
        defaultValue: 0.00,
        allowNull: false
      }
    });

    await queryInterface.createTable('Movie', {
      id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.DataTypes.STRING,
      genre: Sequelize.DataTypes.STRING,
    });

    await queryInterface.createTable('Showtimes', {
      id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true,
      },
      movie_id: {
        type: 'integer',
        allowNull: false,
        references: {
          model: {
            tableName: 'Movie',
          },
          key: 'id',
        },
      },
      show_room_id: {
        type: 'integer',
        allowNull: false,
        references: {
          model: {
            tableName: 'Showroom',
          },
          key: 'id',
        },
      },
      createdAt: {
        type: 'timestamp',
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: 'timestamp',
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('Pricingscheme', {
      id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.DataTypes.STRING,
      price_markup: Sequelize.DataTypes.DECIMAL,
      markup_type: {
        type: Sequelize.DataTypes.ENUM,
        values: [
          'fixed',
          'percent',
        ],
        defaultValue: 'fixed'

      },
    });

    await queryInterface.createTable('SeatCategory', {
      id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      pricing_scheme: {
        type: 'integer',
        allowNull: true,
        references: {
          model: {
            tableName: 'Pricingscheme',
          },
          key: 'id',
        },
      }
    });

    await queryInterface.createTable('SeatingMap', {
      id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true,
      },
      seat_addr: Sequelize.DataTypes.STRING,
      showroom_id: {
        type: 'integer',
        allowNull: false,
        references: {
          model: {
            tableName: 'Showroom',
          },
          key: 'id',
        },
      },
      seat_category_id: {
        type: 'integer',
        allowNull: true,
        references: {
          model: {
            tableName: 'SeatCategory',
          },
          key: 'id',
        },
      },
      createdAt: {
        type: 'timestamp',
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: 'timestamp',
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: (queryInterface: QueryInterface) => {
    // do nothing
  },
};
