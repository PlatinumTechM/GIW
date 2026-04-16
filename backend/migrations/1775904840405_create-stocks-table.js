/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE diamond_stock (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        type VARCHAR(255),
        user_id BIGINT,
        stock_id VARCHAR(255),
        certificate_number BIGINT,
        weight NUMERIC(12,3),
        shape VARCHAR(255),
        color VARCHAR(255),
        fancy_color VARCHAR(255),
        fancy_color_intensity VARCHAR(255),
        fancy_color_overtone VARCHAR(255),
        clarity VARCHAR(255),
        cut VARCHAR(255),
        polish VARCHAR(255),
        symmetry VARCHAR(255),
        fluorescence VARCHAR(255),
        fluorescence_color VARCHAR(255),
        fluorescence_intensity VARCHAR(255),
        measurements VARCHAR(255),
        length NUMERIC(12,3),
        width NUMERIC(12,3),
        height NUMERIC(12,3),
        shade VARCHAR(255),
        milky VARCHAR(255),
        eye_clean VARCHAR(255),
        lab VARCHAR(255),
        certificate_comment VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        country VARCHAR(255),
        treatment VARCHAR(255),
        depth_percentage NUMERIC(12, 3),
        table_percentage NUMERIC(12, 3),
        rap_per_carat NUMERIC(12, 3),
        price_per_carat NUMERIC(12, 3),
        final_price NUMERIC(12, 3),
        dollar_rate NUMERIC(12, 3),
        rs_amount NUMERIC(12, 3),
        discount NUMERIC(12, 3),
        heart_arrow BOOLEAN,
        star_length VARCHAR(255),
        laser_description VARCHAR(255),
        growth_type VARCHAR(255),
        key_to_symbol VARCHAR(255),
        lw_ratio VARCHAR(255),
        culet_size VARCHAR(255),
        culet_condition VARCHAR(255),
        gridle_thin VARCHAR(255),
        gridle_thick VARCHAR(255),
        gridle_condition VARCHAR(255),
        gridle_per VARCHAR(255),
        crown_height VARCHAR(255),
        crown_angle VARCHAR(255),
        pavilion_depth VARCHAR(255),
        pavilion_angle VARCHAR(255),
        status VARCHAR(255),
        diamond_type VARCHAR(255),
        diamond_image1 TEXT,
        diamond_image2 TEXT,
        diamond_image3 TEXT,
        diamond_image4 TEXT,
        diamond_image5 TEXT,
        diamond_video TEXT,
        certificate_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    )
    `,
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DROP TABLE diamond_stock`);
};
