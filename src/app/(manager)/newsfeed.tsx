import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Heart, ThumbsUp, MessageSquare, Plus, Search, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { getToken } from '../../auth';
import { getNewsFeed, createPost } from '../../services/newsfeed.service';

export default function FactoryNewsFeed() {
  const [showInput, setShowInput] = useState(false);
  const [postText, setPostText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  const loadPosts = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await getNewsFeed(token);
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.log('newsfeed load failed', e); }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleLike = (targetId: string) => { 
    setPosts((prevPosts) =>
      prevPosts.map((item) => {
        if (item.postId === targetId) {
          return {
            ...item,
            likes: 0,
            hasLiked: !item.hasLiked,
          };
        }
        return item;
      })
    );
  };

  const handleCommentPress = (authorName: string) => {
    Alert.alert('Comments', `Opening discussion thread for ${authorName}'s post...`);
  };

  const handlePublishPost = async () => {
    if (!postText.trim()) {
      Alert.alert('Empty Post', 'Please write a message before publishing.');
      return;
    }
    try {
      const token = await getToken();
      if (token) {
        await createPost(token, { content: postText });
        setPostText('');
        setShowInput(false);
        await loadPosts();
      }
    } catch (e) {
      Alert.alert('Failed', 'Could not publish post.');
    }
  };

  const filteredPosts = posts.filter((item) => 
    (item.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.authorName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screenWrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#2552b4" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Factory News Feed</Text>
        </View>

        <View style={styles.mainContentContainer}>
          {/* Search Box */}
          <View style={styles.searchBarContainer}>
            <Search color="#94a3b8" size={18} style={styles.searchIcon} />
            <TextInput
              style={styles.searchField}
              placeholder="Search posts or names..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
            {/* New Post Toggle */}
            <TouchableOpacity style={styles.newPostButton} onPress={() => setShowInput(!showInput)}>
              <View style={styles.buttonInlineRow}>
                {showInput ? (
                  <>
                    <X color="#2552b4" size={16} style={styles.inlineIcon} />
                    <Text style={styles.newPostButtonText}>Cancel</Text>
                  </>
                ) : (
                  <>
                    <Plus color="#2552b4" size={16} style={styles.inlineIcon} />
                    <Text style={styles.newPostButtonText}>New post</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Post Input Form */}
            {showInput && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textField}
                  placeholder="Write your update here..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  value={postText}
                  onChangeText={setPostText}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handlePublishPost}>
                  <Text style={styles.submitButtonText}>Publish Post</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Posts Loop */}
            {filteredPosts.map((item) => (
              <View key={item.postId} style={styles.postCard}>
                <View style={styles.profileRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{(item.authorName || "?").substring(0,2).toUpperCase()}</Text>
                  </View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.profileName}>{item.authorName || "Staff"}</Text>
                    <Text style={styles.profileRole}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{item.content}</Text>
                
                <View style={styles.divider} />

                {/* Like & Comment Row */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.postId)}>
  <View style={styles.actionButtonContent}>
    <ThumbsUp 
      color={item.hasLiked ? '#2552b4' : '#64748b'} 
      fill={item.hasLiked ? '#2552b4' : 'none'} 
      size={18} 
      style={styles.inlineIcon} 
    />
    <Text style={[styles.actionText, item.hasLiked && { color: '#2552b4' }]}>
      {item.hasLiked ? 'Liked' : 'Like'}
    </Text>
  </View>
</TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton} onPress={() => handleCommentPress(item.authorName || "this")}>
                    <View style={styles.actionButtonContent}>
                      <MessageSquare color="#64748b" size={18} style={styles.inlineIcon} />
                      <Text style={styles.actionText}>Comment</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {filteredPosts.length === 0 && (
              <Text style={styles.emptyText}>No matches found.</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: '#2552b4' },
  safeArea: { flex: 1 },
  headerContainer: { width: '100%', paddingTop: 16, paddingBottom: 10, alignItems: 'center', backgroundColor: '#2552b4' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  mainContentContainer: { flex: 1, backgroundColor: '#f4f6f9', paddingHorizontal: 16 },
  scrollPadding: { paddingBottom: 24 },
  searchBarContainer: {
    marginVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: { marginRight: 8 },
  searchField: { flex: 1, color: '#0f172a', fontSize: 14 },
  postCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 14 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#99c2f5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#2b65b6', fontSize: 13, fontWeight: '700' },
  nameContainer: { justifyContent: 'center' },
  profileName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  profileRole: { fontSize: 12, color: '#64748b', marginTop: 2 },
  postContent: { fontSize: 14, color: '#1e293b', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  actionButton: { paddingVertical: 4, paddingHorizontal: 12 },
  actionButtonContent: { flexDirection: 'row', alignItems: 'center' },
  inlineIcon: { marginRight: 6 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  likedText: { color: '#ef4444' },
  newPostButton: { borderWidth: 1.5, borderColor: '#2552b4', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginVertical: 8 },
  buttonInlineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  newPostButtonText: { color: '#2552b4', fontSize: 14, fontWeight: '600' },
  inputContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#cbd5e1' },
  textField: { height: 80, color: '#0f172a', fontSize: 14, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#2552b4', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 20, fontSize: 14 },
});