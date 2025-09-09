#!/usr/bin/env node

// Script to count celebrity analyses from Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://nhjjzcsnmyotyhykbajc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oamp6Y3NubXlvdHloeWtiYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTg2MzAsImV4cCI6MjA2NzQ5NDYzMH0.BByJQqr2aWvPa3_Jwh3t3VGVV2KNIIcwKk8-EbFrix8';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function countCelebrityAnalyses() {
  try {
    // Count total records in blogs_famous_people
    const { data, error, count } = await supabase
      .from('blogs_famous_people')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error querying Supabase:', error);
      return;
    }

    console.log(`\n=== Celebrity Analysis Count ===`);
    console.log(`Total celebrity analyses in database: ${count}`);

    // Get a sample to show categories
    const { data: sampleData, error: sampleError } = await supabase
      .from('blogs_famous_people')
      .select('name, category')
      .limit(10);

    if (!sampleError && sampleData) {
      console.log(`\nSample of analyses:`);
      sampleData.forEach(person => {
        console.log(`- ${person.name} (${person.category || 'uncategorized'})`);
      });
    }

    // Count by category if the field exists
    const { data: categories, error: catError } = await supabase
      .from('blogs_famous_people')
      .select('category')
      .not('category', 'is', null);

    if (!catError && categories) {
      const categoryCounts = {};
      categories.forEach(row => {
        const cat = row.category || 'uncategorized';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      console.log(`\nBreakdown by category:`);
      Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
          console.log(`- ${category}: ${count}`);
        });
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

countCelebrityAnalyses();