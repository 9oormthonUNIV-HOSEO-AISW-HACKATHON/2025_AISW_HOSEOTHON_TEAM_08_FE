import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Generation } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GENERATIONS: Generation[] = ['10대', '20대', '30대', '40대', '50대+'];

export default function OnboardingScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [userGeneration, setUserGeneration] = useState<Generation>('20대');
    const [companionGeneration, setCompanionGeneration] = useState<Generation>('50대+');
    const [showUserPicker, setShowUserPicker] = useState(false);
    const [showCompanionPicker, setShowCompanionPicker] = useState(false);

    const handleNext = () => {
        navigation.navigate('Diagnosis', {
            userGeneration,
            companionGeneration,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>어떤 세대와 함께{'\n'}여행하시나요?</Text>
                </View>

                <Card style={styles.sectionCard}>
                    <Text style={styles.label}>당신은 어떤 세대인가요?</Text>
                    <TouchableOpacity
                        style={[
                            styles.picker,
                            showUserPicker && styles.pickerActive
                        ]}
                        onPress={() => setShowUserPicker(!showUserPicker)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.pickerText}>{userGeneration}</Text>
                        <Text style={styles.pickerArrow}>
                            {showUserPicker ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                    {showUserPicker && (
                        <View style={styles.pickerOptions}>
                            {GENERATIONS.map((gen) => (
                                <TouchableOpacity
                                    key={gen}
                                    style={[
                                        styles.pickerOption,
                                        userGeneration === gen && styles.pickerOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setUserGeneration(gen);
                                        setShowUserPicker(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.pickerOptionText,
                                            userGeneration === gen && styles.pickerOptionTextSelected,
                                        ]}
                                    >
                                        {gen}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </Card>

                <Card style={styles.sectionCard}>
                    <Text style={styles.label}>누구와 함께가시나요?</Text>
                    <TouchableOpacity
                        style={[
                            styles.picker,
                            showCompanionPicker && styles.pickerActive
                        ]}
                        onPress={() => setShowCompanionPicker(!showCompanionPicker)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.pickerText}>
                            {companionGeneration === '50대+'
                                ? `부모님 세대 (${companionGeneration})`
                                : companionGeneration}
                        </Text>
                        <Text style={styles.pickerArrow}>
                            {showCompanionPicker ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                    {showCompanionPicker && (
                        <View style={styles.pickerOptions}>
                            {GENERATIONS.map((gen) => (
                                <TouchableOpacity
                                    key={gen}
                                    style={[
                                        styles.pickerOption,
                                        companionGeneration === gen && styles.pickerOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setCompanionGeneration(gen);
                                        setShowCompanionPicker(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.pickerOptionText,
                                            companionGeneration === gen && styles.pickerOptionTextSelected,
                                        ]}
                                    >
                                        {gen === '50대+' ? `부모님 세대 (${gen})` : gen}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </Card>

                <Card variant="info" style={styles.tipCard}>
                    <Text style={styles.tipTitle}>💬 Tip</Text>
                    <Text style={styles.tipText}>
                        세대마다 여행을 보는 눈이 달라요{'\n'}
                        차이를 이해하면 여행이 더 즐거워져요!
                    </Text>
                </Card>

                <Button
                    title="다음 ▶"
                    onPress={handleNext}
                    variant="primary"
                    style={styles.button}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        lineHeight: 38,
    },
    sectionCard: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    picker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 18,
        backgroundColor: Colors.backgroundLight,
    },
    pickerActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    pickerText: {
        fontSize: 18,
        color: Colors.text,
        fontWeight: '500',
    },
    pickerArrow: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    pickerOptions: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: Colors.card,
        overflow: 'hidden',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pickerOption: {
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    pickerOptionSelected: {
        backgroundColor: Colors.primaryLight,
    },
    pickerOptionText: {
        fontSize: 16,
        color: Colors.text,
    },
    pickerOptionTextSelected: {
        color: Colors.primary,
        fontWeight: '700',
    },
    tipCard: {
        marginTop: 8,
        marginBottom: 32,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 12,
    },
    tipText: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 24,
    },
    button: {
        marginTop: 8,
    },
});

