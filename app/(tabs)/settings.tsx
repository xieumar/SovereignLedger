import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Bell, User, ChevronRight, ShieldCheck, KeyRound, 
  Banknote, Globe, HelpCircle, LogOut, Settings as SettingsIcon,
  MessageSquare
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card } from '@/components/ui';

export default function SettingsScreen() {
  const router = useRouter();
  const [biometrics, setBiometrics] = useState(true);

  const SettingItem = ({ icon: Icon, title, sub, onPress, right }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemIconWrap}>
        <Icon size={20} color={COLORS.primary} />
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{title}</Text>
        {sub && <Text style={styles.itemSub}>{sub}</Text>}
      </View>
      {right ? right : <ChevronRight size={18} color={COLORS.textMuted} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SettingsIcon size={20} color={COLORS.primaryDark} />
          <Text style={styles.appName}>Settings</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <User size={32} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.profileName}>Alexander Sterling</Text>
              <Text style={styles.profileEmail}>alex.sterling@ledger.com</Text>
            </View>
          </View>
          
          <View style={styles.profileButtons}>
            <TouchableOpacity style={styles.pBtn}>
              <User size={16} color={COLORS.primaryDark} />
              <Text style={styles.pBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pBtn, styles.pBtnDark]}>
              <MessageSquare size={16} color="#fff" />
              <Text style={[styles.pBtnText, { color: '#fff' }]}>Support</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Security Section */}
        <Text style={styles.sectionLabel}>SECURITY & ACCESS</Text>
        <Card style={styles.sectionCard}>
          <SettingItem 
            icon={ShieldCheck} 
            title="Biometrics" 
            sub="FaceID or TouchID Enabled"
            right={
              <Switch 
                value={biometrics} 
                onValueChange={(val) => {
                  setBiometrics(val);
                  if (val) router.push('/liveness');
                }}
                trackColor={{ false: '#E2E8F0', true: '#00D4AA' }}
                thumbColor="#fff"
              />
            }
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={KeyRound} 
            title="User Password" 
            sub="Last updated 3 days ago"
            onPress={() => router.push('/change-password' as any)}
          />
        </Card>

        {/* Preferences Section */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <Card style={styles.sectionCard}>
          <SettingItem 
            icon={Banknote} 
            title="Currency" 
            sub="USD ($)"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Globe} 
            title="Language" 
            sub="English (US)"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={HelpCircle} 
            title="Help Center" 
            sub="FAQs and tutorials"
            onPress={() => {}}
          />
        </Card>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn}>
          <LogOut size={20} color={COLORS.expense} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  appName: { color: COLORS.primaryDark, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  content: { padding: SPACING.md, paddingBottom: 100 },

  profileCard: { padding: SPACING.lg, borderRadius: RADIUS.xl, marginBottom: SPACING.xl },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: SPACING.xl },
  profileAvatar: { 
    width: 64, height: 64, borderRadius: 32, 
    backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' 
  },
  profileName: { fontSize: 20, fontWeight: '800', color: COLORS.primaryDark, marginBottom: 2 },
  profileEmail: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  
  profileButtons: { flexDirection: 'row', gap: 12 },
  pBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    gap: 8, paddingVertical: 12, borderRadius: RADIUS.lg, backgroundColor: '#F1F5F9' 
  },
  pBtnDark: { backgroundColor: COLORS.primaryDark },
  pBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },

  sectionLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  sectionCard: { padding: 0, borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.xl },
  
  item: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg },
  itemIconWrap: { 
    width: 40, height: 40, borderRadius: RADIUS.md, 
    backgroundColor: COLORS.primary + '10', alignItems: 'center', justifyContent: 'center', marginRight: 16 
  },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  itemSub: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 72 },

  signOutBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    gap: 10, paddingVertical: 16, borderRadius: RADIUS.xl, backgroundColor: '#FFF5F5',
    borderWidth: 1, borderColor: '#FED7D7'
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: COLORS.expense },
});
