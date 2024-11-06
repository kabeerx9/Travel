"use client"

import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
})

export function ItineraryDocument({ data }) {
  const { destination, dates, travelers, groupType, tripStyle, budget, activities, activityLevel } = data
  const days = Math.ceil((dates.to - dates.from) / (1000 * 60 * 60 * 24))

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cover Page */}
        <View style={styles.header}>
          <Text style={styles.title}>Travel Itinerary</Text>
          <Text style={styles.subtitle}>{destination}</Text>
          <Text style={styles.text}>
            {format(dates.from, 'MMM dd, yyyy')} - {format(dates.to, 'MMM dd, yyyy')}
          </Text>
          <Text style={styles.text}>
            {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'} • {groupType.charAt(0).toUpperCase() + groupType.slice(1)}
          </Text>
        </View>

        {/* Trip Overview */}
        <View style={styles.section}>
          <Text style={[styles.text, styles.bold]}>Trip Overview</Text>
          <Text style={styles.text}>Style: {tripStyle.charAt(0).toUpperCase() + tripStyle.slice(1)}</Text>
          <Text style={styles.text}>Daily Budget: ₹{budget}</Text>
          <Text style={styles.text}>Activity Level: {activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1)}</Text>
          <Text style={styles.text}>Activities: {activities.join(', ')}</Text>
        </View>

        {/* Daily Schedule */}
        {Array.from({ length: days }).map((_, index) => (
          <View key={index} style={styles.daySection}>
            <Text style={styles.dayTitle}>Day {index + 1}</Text>
            <Text style={styles.text}>Morning: Activity based on preferences</Text>
            <Text style={styles.text}>Afternoon: Flexible time for exploration</Text>
            <Text style={styles.text}>Evening: Local experiences</Text>
          </View>
        ))}

        {/* Important Notes */}
        <View style={styles.section}>
          <Text style={[styles.text, styles.bold]}>Important Notes</Text>
          <Text style={styles.text}>• Remember to carry necessary travel documents</Text>
          <Text style={styles.text}>• Check local weather conditions before activities</Text>
          <Text style={styles.text}>• Keep emergency contacts handy</Text>
        </View>
      </Page>
    </Document>
  )
}