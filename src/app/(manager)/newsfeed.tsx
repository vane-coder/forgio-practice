import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

// ─── Team Standard Config Imports (Section 4 & 5 — Forgio Setup Guide) ───────
import { colors, fontSizes } from '../../config/theme';

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = 'Manager' | 'Dept Head' | 'Supervisor' | 'Operator';

interface Post {
  id: string;
  author: string;
  initials: string;
  role: Role;
  timeAgo: string;
  message: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Raina Pryce',
    initials: 'RP',
    role: 'Manager',
    timeAgo: '2h ago',
    message: "Production target for this week is 5,000 units. Let's push through!",
  },
  {
    id: '2',
    author: 'Attuah Jessica',
    initials: 'AJ',
    role: 'Dept Head',
    timeAgo: '5h ago',
    message: 'Cutting dept hit 800 units today. Great work team!',
  },
];

// ─── Role → accent colour mapping ────────────────────────────────────────────
const roleColor: Record<Role, string> = {
  Manager: colors.primaryBlue,
  'Dept Head': colors.secondaryBlue,
  Supervisor: colors.success,
  Operator: colors.textSecondary,
};

// ─── Avatar component ─────────────────────────────────────────────────────────
function Avatar({ initials, role }: { initials: string; role: Role }) {
  return (
    <View style={[styles.avatar, { backgroundColor: roleColor[role] }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

// ─── Post Card component ──────────────────────────────────────────────────────
function PostCard({ item }: { item: Post }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Avatar initials={item.initials} role={item.role} />
        <View style={styles.cardMeta}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.authorRole}>
            {item.role} · {item.timeAgo}
          </Text>
        </View>
      </View>
      <Text style={styles.cardMessage}>{item.message}</Text>
    </View>
  );
}

// ─── New Post Modal ────────────────────────────────────────────────────────────
interface NewPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

function NewPostModal({ visible, onClose, onSubmit }: NewPostModalProps) {
  const [text, setText] = useState('');

  function handleSubmit() {
    if (text.trim().length === 0) return;
    onSubmit(text.trim());
    setText('');
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>New Post</Text>

          <TextInput
            style={styles.textArea}
            placeholder="What's happening on the floor?"
            placeholderTextColor={colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoFocus
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.postBtn, !text.trim() && styles.postBtnDisabled]}
              onPress={handleSubmit}
              disabled={!text.trim()}
            >
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NewsFeedScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [modalVisible, setModalVisible] = useState(false);

  function handleNewPost(message: string) {
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'You',
      initials: 'YO',
      role: 'Operator',
      timeAgo: 'just now',
      message,
    };
    setPosts([newPost, ...posts]);
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Factory News Feed</Text>
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      {/* New Post Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.newPostBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.newPostBtnText}>+ New post</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <NewPostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleNewPost}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // 1. Base Screen Layout
  screen: {
    flex: 1,
    backgroundColor: colors.primaryBlue, // This keeps the safe area background seamless blue!
  },

  // 2. The Header Panel Fix
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: colors.primaryBlue, // Matches standard guide usage for headers
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,                        // Scale: 2xl per Section 5.3
    fontWeight: '700',                   // Inter Bold per Section 5.1
    color: '#FFFFFF',                    // High-contrast clean white text over blue
    letterSpacing: -0.3,
  },

  // 3. The Main Feed Content Backdrop
  listContent: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.background,  // Standard gray background palette
    borderTopLeftRadius: 24,             // Smoothly transitions into the blue header
    borderTopRightRadius: 24,
    minHeight: '100%',
  },
  separator: {
    height: 12,
  },

  // 4. Cards
  card: {
    backgroundColor: colors.surface,     // Surfaces are white per instructions
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardMeta: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 16,                        // Scale: base per Section 5.3
    fontWeight: '600',                   // Inter SemiBold per Section 5.1
    color: colors.textPrimary,
  },
  authorRole: {
    fontSize: 12,                        // Scale: xs per Section 5.3
    fontWeight: '400',                   // Inter Regular per Section 5.1
    color: colors.textSecondary,
    marginTop: 1,
  },
  cardMessage: {
    fontSize: 14,                        // Scale: sm per Section 5.3
    fontWeight: '400',                   // Inter Regular per Section 5.1
    color: colors.textPrimary,
    lineHeight: 21,
  },

  // 5. Avatars
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E2E8F0',          
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.secondaryBlue,         
    fontSize: 14,
    fontWeight: '700',
  },

  // 6. Action Footer Panel
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  newPostBtn: {
    borderWidth: 1.5,
    borderColor: colors.secondaryBlue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  newPostBtnText: {
    color: colors.secondaryBlue,
    fontSize: 16,
    fontWeight: '600',
  },

  // 7. Interactive Creation Drawer Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalTitle: {
    fontSize: 20,                        // Scale: xl per Section 5.3
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 100,
    backgroundColor: colors.background,
    fontWeight: '400',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  postBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primaryBlue,
  },
  postBtnDisabled: {
    backgroundColor: colors.border,
  },
  postBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});


